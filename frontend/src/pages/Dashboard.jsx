import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getUserProfile, updateUserProfile } from '../store/userSlice'
import AlertsPanel from '../components/AlertsPanel'
import useNarration from '../hooks/useNarration'
import axios from 'axios'

const Dashboard = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { token } = useSelector((state) => state.auth)
  const { profile } = useSelector((state) => state.user)
  const [hoveredPlanet, setHoveredPlanet] = useState(null)
  const [isListening, setIsListening] = useState(false)
  const [showAccessibility, setShowAccessibility] = useState(false)
  const [stars, setStars] = useState([])
  
  // Narration functionality
  const { speak, stop, isPlaying, currentText } = useNarration()
  
  // Accessibility settings state
  const [fontSize, setFontSize] = useState('medium')
  const [colorFilter, setColorFilter] = useState('none')
  const [dyslexiaFont, setDyslexiaFont] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [narrationEnabled, setNarrationEnabled] = useState(false)

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

  // Load accessibility settings from profile
  useEffect(() => {
    if (profile?.accessibility) {
      setFontSize(profile.accessibility.fontSize || 'medium')
      setColorFilter(profile.accessibility.colorFilter || 'none')
      setDyslexiaFont(profile.accessibility.dyslexiaFont || false)
      setHighContrast(profile.accessibility.highContrast || false)
      setNarrationEnabled(profile.accessibility.narrationEnabled || false)
    }
  }, [profile])

  // Stop narration when disabled
  useEffect(() => {
    if (!narrationEnabled) {
      stop()
    }
  }, [narrationEnabled, stop])

  // Text hover handlers
  const handleTextHover = useCallback((text) => {
    if (narrationEnabled && text && text.trim()) {
      speak(text)
    }
  }, [narrationEnabled, speak])

  const handleTextLeave = useCallback(() => {
    if (narrationEnabled) {
      stop()
    }
  }, [narrationEnabled, stop])

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
      benefitAmount: profile?.benefits?.healthcare || 0,
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
      benefitAmount: profile?.benefits?.housing || 0,
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
      benefitAmount: profile?.benefits?.snap || 0,
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
      benefitAmount: profile?.benefits?.transportation || 0,
    },
  ]

  const orbits = [200, 250, 300, 350]

  // Save accessibility settings
  const handleAccessibilitySave = async () => {
    const accessibilitySettings = {
      fontSize,
      colorFilter,
      dyslexiaFont,
      highContrast,
      narrationEnabled,
    }
    
    await dispatch(updateUserProfile({
      accessibility: accessibilitySettings,
    }))
    
    setShowAccessibility(false)
  }

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
      <div className="absolute top-0 left-0 right-0 p-6 sm:p-8 flex justify-between items-center z-10">
        <div className="flex items-center">
          <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold tracking-wider flex items-center">
            P
            <span className="relative inline-block mx-1 w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
              <span className="text-white text-2xl sm:text-3xl lg:text-4xl">O</span>
              <svg
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3"
                viewBox="0 0 24 24"
                fill="white"
              >
                {/* 4-pointed star (diamond/compass rose) */}
                <path d="M12 2 L15 12 L12 22 L9 12 Z M2 12 L12 9 L22 12 L12 15 Z" />
              </svg>
            </span>
            LARA
          </h1>
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
          onMouseEnter={() => setHoveredPlanet('ssi')}
          onMouseLeave={() => setHoveredPlanet(null)}
        >
          <motion.div
            className="w-40 h-40 rounded-full bg-gradient-to-br from-yellow-200 to-orange-400 shadow-2xl flex items-center justify-center relative"
            style={{
              boxShadow: '0 0 30px rgba(255, 193, 7, 0.4), 0 0 60px rgba(255, 152, 0, 0.2), 0 0 90px rgba(255, 87, 34, 0.1)'
            }}
            whileHover={{ scale: 1.15 }}
            transition={{ 
              scale: { duration: 0.3, ease: "easeOut" }
            }}
          >
            <div className="text-center pointer-events-none">
              <div className="text-6xl">☀️</div>
            </div>
            
            {/* SSI Tooltip */}
            {hoveredPlanet === 'ssi' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-purple-900/95 backdrop-blur-sm px-4 py-3 rounded-lg shadow-lg whitespace-nowrap z-50"
              >
                <p 
                  className="text-sm font-semibold text-white cursor-pointer hover:text-purple-200 transition-colors"
                  onMouseEnter={() => handleTextHover(t('dashboard.ssi'))}
                  onMouseLeave={handleTextLeave}
                >
                  {t('dashboard.ssi')}
                </p>
                <p 
                  className="text-xs text-purple-200 cursor-pointer hover:text-purple-100 transition-colors"
                  onMouseEnter={() => handleTextHover(`Total Benefits: $${(profile?.benefits?.ssi || 0).toLocaleString()} per month`)}
                  onMouseLeave={handleTextLeave}
                >
                  Total Benefits: ${(profile?.benefits?.ssi || 0).toLocaleString()}/month
                </p>
              </motion.div>
            )}
          </motion.div>
          
          {/* SSI Label - Outside the circular container */}
          <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 text-center">
            <div 
              className="text-sm font-semibold text-orange-900 bg-yellow-200/80 backdrop-blur-sm px-3 py-1 rounded-full cursor-pointer hover:bg-yellow-300/80 transition-colors"
              onMouseEnter={() => handleTextHover(t('dashboard.ssi'))}
              onMouseLeave={handleTextLeave}
            >
              {t('dashboard.ssi')}
            </div>
          </div>
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
              transition={{ 
                delay: index * 0.2, 
                duration: 0.5,
                scale: { duration: 0.3, ease: "easeOut" }
              }}
              whileHover={{ scale: 1.15 }}
              onHoverStart={() => setHoveredPlanet(planet.id)}
              onHoverEnd={() => setHoveredPlanet(null)}
              onClick={() => navigate(planet.route)}
            >
              <motion.div
                className="w-full h-full rounded-full shadow-lg flex items-center justify-center relative"
                style={{ backgroundColor: planet.color }}
              >
                <div className="text-center">
                  <div className="text-4xl">{planet.icon}</div>
                </div>

                {/* Tooltip */}
                {hoveredPlanet === planet.id && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-purple-900/95 backdrop-blur-sm px-4 py-3 rounded-lg shadow-lg whitespace-nowrap z-50"
                  >
                    <p 
                      className="text-sm font-semibold text-white cursor-pointer hover:text-purple-200 transition-colors"
                      onMouseEnter={() => handleTextHover(planet.name)}
                      onMouseLeave={handleTextLeave}
                    >
                      {planet.name}
                    </p>
                    <p 
                      className="text-xs text-purple-200 cursor-pointer hover:text-purple-100 transition-colors"
                      onMouseEnter={() => handleTextHover(`Total Benefits: $${planet.benefitAmount.toLocaleString()} per month`)}
                      onMouseLeave={handleTextLeave}
                    >
                      Total Benefits: ${planet.benefitAmount.toLocaleString()}/month
                    </p>
                  </motion.div>
                )}
              </motion.div>
              
              {/* Benefit Name Label - Outside the circular container */}
              <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 text-center">
                <div 
                  className="text-xs font-semibold text-white bg-black/20 backdrop-blur-sm px-2 py-1 rounded-full cursor-pointer hover:bg-black/30 transition-colors"
                  onMouseEnter={() => handleTextHover(planet.name)}
                  onMouseLeave={handleTextLeave}
                >
                  {planet.name}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Bottom Controls - Single Row */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 z-20">
        <motion.button
          onClick={handleVoiceCommand}
          className={`w-12 h-12 rounded-full ${
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
          onClick={() => setNarrationEnabled(!narrationEnabled)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 relative ${
            narrationEnabled 
              ? 'bg-green-500/80 hover:bg-green-400/80 shadow-lg shadow-green-500/30' 
              : 'bg-white/20 hover:bg-white/30'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label={narrationEnabled ? "Disable Voice Narration" : "Enable Voice Narration"}
        >
          <svg className={`w-6 h-6 ${narrationEnabled ? 'text-white' : 'text-white'}`} fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
              clipRule="evenodd"
            />
          </svg>
          {narrationEnabled && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
              <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
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
      <AnimatePresence>
        {showAccessibility && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-purple-900/95 backdrop-blur-lg rounded-2xl shadow-2xl p-6 w-96 z-30 overflow-hidden"
          >
          <h3 className="text-lg font-bold text-white mb-4">{t('profile.accessibility')}</h3>
          
          {/* Font Size */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-purple-200 mb-2">
              {t('profile.fontSize')}
            </label>
            <div className="flex space-x-2">
              {['small', 'medium', 'large'].map((size) => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    fontSize === size
                      ? 'bg-purple-500 text-white scale-105'
                      : 'bg-purple-700/60 text-purple-100 hover:bg-purple-600 hover:scale-105'
                  }`}
                >
                  {t(`accessibility.${size}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Color Blindness Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-purple-200 mb-2">
              {t('profile.colorBlindness')}
            </label>
            <select
              value={colorFilter}
              onChange={(e) => setColorFilter(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-purple-400/50 bg-purple-800/60 text-purple-100 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-sm font-medium hover:bg-purple-700/60 transition-all duration-200"
            >
              <option value="none">{t('accessibility.none')}</option>
              <option value="protanopia">{t('accessibility.protanopia')}</option>
              <option value="deuteranopia">{t('accessibility.deuteranopia')}</option>
              <option value="tritanopia">{t('accessibility.tritanopia')}</option>
            </select>
          </div>

          {/* Toggle Options */}
          <div className="space-y-3 mb-6">
            <label className="flex items-center justify-between p-4 rounded-xl bg-purple-800/60 hover:bg-purple-700/60 cursor-pointer transition-all duration-200 group">
              <span className="font-semibold text-purple-100 text-sm">{t('profile.dyslexiaFont')}</span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={dyslexiaFont}
                  onChange={(e) => setDyslexiaFont(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-6 h-6 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${
                  dyslexiaFont 
                    ? 'bg-purple-500 border-purple-400 shadow-lg' 
                    : 'bg-purple-700/50 border-purple-500/50 group-hover:border-purple-400 group-hover:bg-purple-600/50'
                }`}>
                  {dyslexiaFont && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            </label>

            <label className="flex items-center justify-between p-4 rounded-xl bg-purple-800/60 hover:bg-purple-700/60 cursor-pointer transition-all duration-200 group">
              <span className="font-semibold text-purple-100 text-sm">{t('profile.highContrast')}</span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={highContrast}
                  onChange={(e) => setHighContrast(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-6 h-6 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${
                  highContrast 
                    ? 'bg-purple-500 border-purple-400 shadow-lg' 
                    : 'bg-purple-700/50 border-purple-500/50 group-hover:border-purple-400 group-hover:bg-purple-600/50'
                }`}>
                  {highContrast && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            </label>

            <label className="flex items-center justify-between p-4 rounded-xl bg-purple-800/60 hover:bg-purple-700/60 cursor-pointer transition-all duration-200 group">
              <span className="font-semibold text-purple-100 text-sm">{t('profile.narration')}</span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={narrationEnabled}
                  onChange={(e) => setNarrationEnabled(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-6 h-6 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${
                  narrationEnabled 
                    ? 'bg-purple-500 border-purple-400 shadow-lg' 
                    : 'bg-purple-700/50 border-purple-500/50 group-hover:border-purple-400 group-hover:bg-purple-600/50'
                }`}>
                  {narrationEnabled && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleAccessibilitySave}
              className="flex-1 px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-400 text-sm font-bold transition-all duration-200 hover:scale-105"
            >
              {t('common.save')}
            </button>
            <button
              onClick={() => setShowAccessibility(false)}
              className="flex-1 px-6 py-3 bg-purple-700/70 text-purple-100 rounded-xl hover:bg-purple-600 text-sm font-bold transition-all duration-200 hover:scale-105"
            >
              {t('common.cancel')}
            </button>
          </div>
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Dashboard
