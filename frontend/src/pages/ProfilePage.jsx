import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserProfile } from '../store/userSlice'
import { logout } from '../store/authSlice'
import VoiceButton from '../components/VoiceButton'
import AlertsPanel from '../components/AlertsPanel'

const ProfilePage = () => {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch()
  const { profile } = useSelector((state) => state.user)
  const { user } = useSelector((state) => state.auth)

  const [name, setName] = useState('')
  const [language, setLanguage] = useState('en')
  const [fontSize, setFontSize] = useState('medium')
  const [colorFilter, setColorFilter] = useState('none')
  const [dyslexiaFont, setDyslexiaFont] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [narrationEnabled, setNarrationEnabled] = useState(false)

  useEffect(() => {
    if (profile) {
      setName(profile.name || '')
      setLanguage(profile.language || 'en')
      setFontSize(profile.accessibility?.fontSize || 'medium')
      setColorFilter(profile.accessibility?.colorFilter || 'none')
      setDyslexiaFont(profile.accessibility?.dyslexiaFont || false)
      setHighContrast(profile.accessibility?.highContrast || false)
      setNarrationEnabled(profile.accessibility?.narrationEnabled || false)
    } else if (user) {
      setName(user.name || '')
      setLanguage(user.language || 'en')
    }
  }, [profile, user])

  const handleSave = async () => {
    await dispatch(
      updateUserProfile({
        name,
        language,
        accessibility: {
          fontSize,
          colorFilter,
          dyslexiaFont,
          highContrast,
          narrationEnabled,
        },
      })
    )
    i18n.changeLanguage(language)
    alert('Profile updated successfully!')
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const languages = [
    { code: 'en', name: 'English 🇺🇸' },
    { code: 'es', name: 'Español 🇪🇸' },
    { code: 'fr', name: 'Français 🇫🇷' },
    { code: 'zh', name: '中文 🇨🇳' },
    { code: 'hi', name: 'हिन्दी 🇮🇳' },
    { code: 'tl', name: 'Tagalog 🇵🇭' },
    { code: 'vi', name: 'Tiếng Việt 🇻🇳' },
  ]

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <div className="sticky top-0 bg-purple-900/50 backdrop-blur-lg z-10 p-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={() => navigate('/dashboard')}
            className="text-white hover:text-purple-200 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </motion.button>
          <h1 className="text-3xl font-bold text-white">{t('profile.title')}</h1>
        </div>
        <AlertsPanel />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl"
        >
          {/* Basic Info */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-purple-900 mb-6">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Language Settings */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-purple-900 mb-6">{t('profile.language')}</h2>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Accessibility Settings */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-purple-900 mb-6">{t('profile.accessibility')}</h2>
            
            {/* Font Size */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('profile.fontSize')}
              </label>
              <div className="flex space-x-4">
                {['small', 'medium', 'large'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      fontSize === size
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {t(`accessibility.${size}`)}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Blindness Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('profile.colorBlindness')}
              </label>
              <select
                value={colorFilter}
                onChange={(e) => setColorFilter(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="none">{t('accessibility.none')}</option>
                <option value="protanopia">{t('accessibility.protanopia')}</option>
                <option value="deuteranopia">{t('accessibility.deuteranopia')}</option>
                <option value="tritanopia">{t('accessibility.tritanopia')}</option>
              </select>
            </div>

            {/* Toggle Options */}
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer">
                <span className="font-medium text-gray-700">{t('profile.dyslexiaFont')}</span>
                <input
                  type="checkbox"
                  checked={dyslexiaFont}
                  onChange={(e) => setDyslexiaFont(e.target.checked)}
                  className="w-6 h-6 rounded text-purple-600 focus:ring-purple-500"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer">
                <span className="font-medium text-gray-700">{t('profile.highContrast')}</span>
                <input
                  type="checkbox"
                  checked={highContrast}
                  onChange={(e) => setHighContrast(e.target.checked)}
                  className="w-6 h-6 rounded text-purple-600 focus:ring-purple-500"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer">
                <span className="font-medium text-gray-700">{t('profile.narration')}</span>
                <input
                  type="checkbox"
                  checked={narrationEnabled}
                  onChange={(e) => setNarrationEnabled(e.target.checked)}
                  className="w-6 h-6 rounded text-purple-600 focus:ring-purple-500"
                />
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <motion.button
              onClick={handleSave}
              className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {t('common.save')}
            </motion.button>
            <motion.button
              onClick={handleLogout}
              className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Logout
            </motion.button>
          </div>
        </motion.div>
      </div>

      <VoiceButton />
    </div>
  )
}

export default ProfilePage

