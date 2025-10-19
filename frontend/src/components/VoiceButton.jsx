import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const VoiceButton = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleVoiceCommand = async () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported')
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.lang = 'en-US'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript
      setIsListening(false)
      setIsProcessing(true)

      try {
        // Classify intent using Gemini API
        const response = await axios.post(
          '/api/ai/classify-intent',
          { transcript },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const { intent, parameters } = response.data

        // Execute action based on intent
        switch (intent) {
          case 'navigate_healthcare':
            navigate('/healthcare')
            break
          case 'navigate_housing':
            navigate('/housing')
            break
          case 'navigate_food':
            navigate('/food')
            break
          case 'navigate_transportation':
            navigate('/transportation')
            break
          case 'navigate_ssi':
            navigate('/ssi')
            break
          case 'navigate_profile':
            navigate('/profile')
            break
          case 'navigate_dashboard':
            navigate('/dashboard')
            break
          default:
            console.log('Intent not recognized:', intent)
        }
      } catch (error) {
        console.error('Voice command error:', error)
      } finally {
        setIsProcessing(false)
      }
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
      setIsProcessing(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  return (
    <motion.button
      onClick={handleVoiceCommand}
      className="fixed bottom-8 left-8 w-16 h-16 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg flex items-center justify-center z-50"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      animate={isListening ? { scale: [1, 1.2, 1] } : {}}
      transition={isListening ? { repeat: Infinity, duration: 1 } : {}}
      aria-label={t('voice.clickToSpeak')}
    >
      {isListening ? (
        <motion.div
          className="w-4 h-4 bg-red-500 rounded-full"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ repeat: Infinity, duration: 0.5 }}
        />
      ) : isProcessing ? (
        <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </motion.button>
  )
}

export default VoiceButton

