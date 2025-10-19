import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'

export const useNarration = (pageName) => {
  const [isNarrating, setIsNarrating] = useState(false)
  const [narrationText, setNarrationText] = useState('')
  const { token } = useSelector((state) => state.auth)
  const { accessibility } = useSelector((state) => state.user)

  const playNarration = async () => {
    if (!accessibility?.narrationEnabled || !token) {
      console.log('Narration not enabled or no token')
      return
    }

    setIsNarrating(true)

    try {
      const response = await axios.post(
        '/api/voice/narrate-page',
        { page: pageName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const { text, audio } = response.data

      setNarrationText(text)

      // Convert base64 audio to blob and play
      const audioBlob = base64ToBlob(audio, 'audio/mpeg')
      const audioUrl = URL.createObjectURL(audioBlob)
      const audioElement = new Audio(audioUrl)

      audioElement.onended = () => {
        setIsNarrating(false)
        URL.revokeObjectURL(audioUrl)
      }

      audioElement.onerror = () => {
        setIsNarrating(false)
        URL.revokeObjectURL(audioUrl)
      }

      await audioElement.play()
    } catch (error) {
      console.error('Narration error:', error)
      setIsNarrating(false)
    }
  }

  // Auto-play narration when page loads if enabled
  useEffect(() => {
    if (accessibility?.narrationEnabled) {
      // Delay to allow page to render
      const timer = setTimeout(() => {
        playNarration()
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [pageName, accessibility?.narrationEnabled])

  return {
    isNarrating,
    narrationText,
    playNarration,
  }
}

// Helper function to convert base64 to blob
function base64ToBlob(base64, contentType) {
  const byteCharacters = atob(base64)
  const byteArrays = []

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512)
    const byteNumbers = new Array(slice.length)

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    byteArrays.push(byteArray)
  }

  return new Blob(byteArrays, { type: contentType })
}

