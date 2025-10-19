import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getUserProfile } from '../store/userSlice'
import AlertsPanel from '../components/AlertsPanel'
import axios from 'axios'

const Dashboard = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { token } = useSelector((state) => state.auth)
  const [hoveredPlanet, setHoveredPlanet] = useState(null)
  const [isListening, setIsListening] = useState(false)
  const [showAccessibility, setShowAccessibility] = useState(false)
  const [stars, setStars] = useState([])

  useEffect(() => {
    dispatch(getUserProfile())
    
    // Generate random stars
    const newStars = Array.from({ length: 200 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.3,
    }))
    setStars(newStars)
  }, [dispatch])

  const planets = [
    {
      id: 'healthcare',
      name: t('dashboard.healthcare'),
      icon: '🏥',
      color: '#60a5fa',
      size: 80,
      orbitRadius: 200,
      angle: 45,
      route: '/healthcare',
    },
    {
      id: 'housing',
      name: t('dashboard.housing'),
      icon: '🏠',
      color: '#34d399',
      size: 80,
      orbitRadius: 250,
      angle: 135,
      route: '/housing',
    },
    {
      id: 'food',
      name: t('dashboard.food'),
      icon: '🍎',
      color: '#fbbf24',
      size: 70,
      orbitRadius: 300,
      angle: 225,
      route: '/food',
    },
    {
      id: 'transportation',
      name: t('dashboard.transportation'),
      icon: '🚌',
      color: '#a78bfa',
      size: 70,
      orbitRadius: 350,
      angle: 315,
      route: '/transportation',
    },
  ]

  const orbits = [200, 250, 300, 350]

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

      try {
        const response = await axios.post(
          '/api/ai/classify-intent',
          { transcript },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const { intent } = response.data

        switch (intent) {
          case 'navigate_healthcare':
          case 'check_healthcare':
          case 'check_medicaid':
          case 'check_medicare':
            navigate('/healthcare')
            break
          case 'navigate_housing':
          case 'check_housing':
            navigate('/housing')
            break
          case 'navigate_food':
          case 'check_food':
          case 'check_snap':
            navigate('/food')
            break
          case 'navigate_transportation':
          case 'check_transportation':
            navigate('/transportation')
            break
          case 'navigate_ssi':
          case 'check_ssi':
          case 'check_ssdi':
            navigate('/ssi')
            break
          case 'navigate_profile':
            navigate('/profile')
            break
          default:
            console.log('Intent not recognized:', intent)
        }
      } catch (error) {
        console.error('Voice command error:', error)
      }
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      {/* Background Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute bg-white rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
          }}
        />
      ))}

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-10">
        <div className="text-white text-3xl font-bold tracking-wider">
          P
          <span className="relative inline-block mx-1 w-8 h-8">
            <span className="text-white">O</span>
            <svg
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3"
              viewBox="0 0 24 24"
              fill="white"
            >
              {/* 4-pointed star (diamond/compass rose) */}
              <path d="M12 2 L15 12 L12 22 L9 12 Z M2 12 L12 9 L22 12 L12 15 Z" />
            </svg>
          </span>
          LARA
        </div>

        <div className="flex items-center space-x-4">
          <AlertsPanel />
          <motion.button
            onClick={() => navigate('/profile')}
            className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Welcome Message at Top */}
      <motion.div
        className="absolute top-24 left-1/2 transform -translate-x-1/2 text-center z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-white text-2xl font-light">
          {t('dashboard.welcome')}, {user?.name}
        </p>
      </motion.div>

      {/* Solar System */}
      <div className="relative w-full h-screen flex items-center justify-center">
        {/* Orbital Rings */}
        {orbits.map((radius, idx) => (
          <div
            key={`orbit-${idx}`}
            className="absolute rounded-full border border-white/10"
            style={{
              width: `${radius * 2}px`,
              height: `${radius * 2}px`,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}

        {/* Central Sun (SSI & Taxes) - Fixed hover */}
        <div
          className="absolute cursor-pointer"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          onClick={() => navigate('/ssi')}
        >
          <motion.div
            className="w-40 h-40 rounded-full bg-gradient-to-br from-yellow-200 to-orange-400 shadow-2xl flex items-center justify-center relative"
            whileHover={{ scale: 1.1 }}
            animate={{
              boxShadow: [
                '0 0 60px rgba(251, 191, 36, 0.6)',
                '0 0 80px rgba(251, 191, 36, 0.8)',
                '0 0 60px rgba(251, 191, 36, 0.6)',
              ],
            }}
            transition={{ 
              boxShadow: { duration: 2, repeat: Infinity },
              scale: { duration: 0.2 }
            }}
          >
            <div className="text-center pointer-events-none">
              <div className="text-6xl mb-2">☀️</div>
              <div className="text-sm font-semibold text-orange-900">{t('dashboard.ssi')}</div>
            </div>
          </motion.div>
        </div>

        {/* Planets */}
        {planets.map((planet, index) => {
          const x = 50 + (planet.orbitRadius / 10) * Math.cos((planet.angle * Math.PI) / 180)
          const y = 50 + (planet.orbitRadius / 10) * Math.sin((planet.angle * Math.PI) / 180)
          
          return (
            <motion.div
              key={planet.id}
              className="absolute cursor-pointer"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: planet.size,
                height: planet.size,
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              whileHover={{ scale: 1.2 }}
              onHoverStart={() => setHoveredPlanet(planet.id)}
              onHoverEnd={() => setHoveredPlanet(null)}
              onClick={() => navigate(planet.route)}
            >
              <motion.div
                className="w-full h-full rounded-full shadow-lg flex items-center justify-center relative"
                style={{ backgroundColor: planet.color }}
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3 + index,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <div className="text-center">
                  <div className="text-4xl">{planet.icon}</div>
                </div>

                {/* Tooltip */}
                {hoveredPlanet === planet.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg whitespace-nowrap z-50"
                  >
                    <p className="text-sm font-semibold text-gray-800">{planet.name}</p>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )
        })}
      </div>

      {/* Bottom Controls - Single Row */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 z-20">
        <motion.button
          onClick={handleVoiceCommand}
          className={`w-14 h-14 rounded-full ${
            isListening ? 'bg-red-500' : 'bg-white/20'
          } hover:bg-white/30 flex items-center justify-center transition-colors`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={isListening ? { scale: [1, 1.1, 1] } : {}}
          transition={isListening ? { repeat: Infinity, duration: 1 } : {}}
          aria-label="Voice Commands"
        >
          {isListening ? (
            <motion.div
              className="w-4 h-4 bg-white rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
            />
          ) : (
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </motion.button>
        
        <motion.button
          className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          aria-label="Volume"
        >
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
              clipRule="evenodd"
            />
          </svg>
        </motion.button>
        
        <motion.button
          onClick={() => setShowAccessibility(!showAccessibility)}
          className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          aria-label="Accessibility"
        >
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
          </svg>
        </motion.button>
      </div>

      {/* Accessibility Panel */}
      {showAccessibility && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-6 w-80 z-30"
        >
          <h3 className="text-lg font-bold text-purple-900 mb-4">Accessibility Settings</h3>
          <p className="text-sm text-gray-600 mb-2">Go to Profile for full settings</p>
          <button
            onClick={() => navigate('/profile')}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Open Profile Settings
          </button>
        </motion.div>
      )}
    </div>
  )
}

export default Dashboard
