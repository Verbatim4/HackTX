import { useState, useCallback, useRef } from 'react'

const useNarration = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentText, setCurrentText] = useState('')
  const audioRef = useRef(null)
  const abortControllerRef = useRef(null)

  const speak = useCallback(async (text, options = {}) => {
    if (!text || isPlaying) return

    // Set default faster speech options
    const speechOptions = {
      rate: 1.5,
      ...options
    }

    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController()

    try {
      setIsPlaying(true)
      setCurrentText(text)

      // ElevenLabs API configuration
      const voiceId = 'pNInz6obpgDQGcFmaJgB' // Adam voice (you can change this)
      const apiKey = process.env.REACT_APP_ELEVEN_LABS_API_KEY || 'your-api-key-here'

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
            speed: 1.2,  // 20% faster speech
            ...options.voiceSettings
          }
        }),
        signal: abortControllerRef.current.signal
      })

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`)
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      
      const audio = new Audio(audioUrl)
      audioRef.current = audio

      audio.onended = () => {
        setIsPlaying(false)
        setCurrentText('')
        URL.revokeObjectURL(audioUrl)
      }

      audio.onerror = () => {
        setIsPlaying(false)
        setCurrentText('')
        URL.revokeObjectURL(audioUrl)
      }

      await audio.play()

    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Narration error:', error)
        // Fallback to browser's built-in speech synthesis
        fallbackSpeak(text, speechOptions)
      }
      setIsPlaying(false)
      setCurrentText('')
    }
  }, [isPlaying])

  const fallbackSpeak = useCallback((text, options = {}) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = options.rate || 1.5  // Increased from 1 to 1.5 for faster speech
      utterance.pitch = options.pitch || 1
      utterance.volume = options.volume || 1
      
      utterance.onend = () => {
        setIsPlaying(false)
        setCurrentText('')
      }
      
      utterance.onerror = () => {
        setIsPlaying(false)
        setCurrentText('')
      }

      speechSynthesis.speak(utterance)
      setIsPlaying(true)
      setCurrentText(text)
    }
  }, [])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    if ('speechSynthesis' in window) {
      speechSynthesis.cancel()
    }

    setIsPlaying(false)
    setCurrentText('')
  }, [])

  return {
    speak,
    stop,
    isPlaying,
    currentText
  }
}

export default useNarration