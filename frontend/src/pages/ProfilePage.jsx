import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserProfile, getUserProfile } from '../store/userSlice'
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
  const [stateCode, setStateCode] = useState('TX')
  const [city, setCity] = useState('')
  // Onboarding fields now editable in Profile
  const [financial, setFinancial] = useState({
    dateOfBirth: '',
    maritalStatus: 'single',
    householdSize: 1,
    numberOfChildren: 0,
    currentIncome: '',
    employmentStatus: 'employed',
    totalWorkYears: '',
    monthlyRent: '',
    monthlyUtilities: '',
    hasDisability: false,
    isPregnant: false,
    isVeteran: false,
    veteranServiceYears: '',
    medicalConditions: [],
    currentBenefits: [],
  })

  useEffect(() => {
    // Ensure latest profile data is loaded when opening Profile
    dispatch(getUserProfile())
  }, [dispatch])

  useEffect(() => {
    if (profile) {
      setName(profile.name || '')
      setLanguage(profile.language || 'en')
      setStateCode(profile.state || 'TX')
      setCity(profile.city || '')
      const fp = profile.financialProfile || {}
      setFinancial({
        dateOfBirth: fp.dateOfBirth || '',
        maritalStatus: fp.maritalStatus || 'single',
        householdSize: fp.householdSize ?? 1,
        numberOfChildren: fp.numberOfChildren ?? 0,
        currentIncome: fp.currentIncome ?? '',
        employmentStatus: fp.employmentStatus || 'employed',
        totalWorkYears: fp.totalWorkYears ?? '',
        monthlyRent: fp.monthlyRent ?? '',
        monthlyUtilities: fp.monthlyUtilities ?? '',
        hasDisability: !!fp.hasDisability,
        isPregnant: !!fp.isPregnant,
        isVeteran: profile?.role === 'veteran' || !!fp.isVeteran,
        veteranServiceYears: fp.veteranServiceYears ?? '',
        medicalConditions: fp.medicalConditions || [],
        currentBenefits: fp.currentBenefits || [],
      })
    } else if (user) {
      setName(user.name || '')
      setLanguage(user.language || 'en')
    }
  }, [profile, user])

  const handleSave = async () => {
    await dispatch(updateUserProfile({ name, language, financialProfile: financial }))
    await dispatch(updateUserProfile({ state: stateCode, city }))
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
          className="bg-purple-900/80 border border-white/10 backdrop-blur-2xl rounded-2xl p-8 shadow-2xl text-white"
        >
          {/* Basic Info */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-black placeholder-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Language Settings */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">{t('profile.language')}</h2>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-black"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Location Settings */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Location</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">State</label>
                <input type="text" value={stateCode} onChange={(e)=>setStateCode(e.target.value.toUpperCase())} className="w-full px-4 py-3 rounded-lg border border-purple-400/40 bg-white text-black focus:ring-2 focus:ring-purple-400 placeholder-gray-500" placeholder="e.g., TX" />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">City</label>
                <input type="text" value={city} onChange={(e)=>setCity(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-purple-400/40 bg-white text-black focus:ring-2 focus:ring-purple-400 placeholder-gray-500" placeholder="e.g., Austin" />
              </div>
            </div>
          </div>

          {/* Financial / Onboarding Settings */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Onboarding Settings</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-purple-100 mb-2">Date of Birth</label>
                <input type="date" value={financial.dateOfBirth || ''} onChange={(e)=>setFinancial({...financial, dateOfBirth: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-purple-400/40 bg-white text-black focus:ring-2 focus:ring-purple-400 placeholder-gray-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-100 mb-2">Marital Status</label>
                <select value={financial.maritalStatus} onChange={(e)=>setFinancial({...financial, maritalStatus:e.target.value})} className="w-full px-4 py-3 rounded-lg border border-purple-400/40 bg-white text-black focus:ring-2 focus:ring-purple-400">
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-100 mb-2">Household Size</label>
                <input type="number" value={financial.householdSize} onChange={(e)=>setFinancial({...financial, householdSize: parseInt(e.target.value)})} className="w-full px-4 py-3 rounded-lg border border-purple-400/40 bg-white text-black focus:ring-2 focus:ring-purple-400 placeholder-gray-500" placeholder="e.g., 2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-100 mb-2">Number of Children</label>
                <input type="number" value={financial.numberOfChildren} onChange={(e)=>setFinancial({...financial, numberOfChildren: parseInt(e.target.value)})} className="w-full px-4 py-3 rounded-lg border border-purple-400/40 bg-white text-black focus:ring-2 focus:ring-purple-400 placeholder-gray-500" placeholder="e.g., 0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-100 mb-2">Current Annual Income ($)</label>
                <input type="number" value={financial.currentIncome} onChange={(e)=>setFinancial({...financial, currentIncome: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-purple-400/40 bg-white text-black focus:ring-2 focus:ring-purple-400 placeholder-gray-500" placeholder="e.g., 50000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-100 mb-2">Employment Status</label>
                <select value={financial.employmentStatus} onChange={(e)=>setFinancial({...financial, employmentStatus:e.target.value})} className="w-full px-4 py-3 rounded-lg border border-purple-400/40 bg-white text-black focus:ring-2 focus:ring-purple-400">
                  <option value="employed">Employed</option>
                  <option value="unemployed">Unemployed</option>
                  <option value="retired">Retired</option>
                  <option value="disabled">Disabled</option>
                  <option value="self-employed">Self-Employed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-100 mb-2">Monthly Rent/Mortgage ($)</label>
                <input type="number" value={financial.monthlyRent} onChange={(e)=>setFinancial({...financial, monthlyRent:e.target.value})} className="w-full px-4 py-3 rounded-lg border border-purple-400/40 bg-white text-black focus:ring-2 focus:ring-purple-400 placeholder-gray-500" placeholder="e.g., 1200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-100 mb-2">Monthly Utilities ($)</label>
                <input type="number" value={financial.monthlyUtilities} onChange={(e)=>setFinancial({...financial, monthlyUtilities:e.target.value})} className="w-full px-4 py-3 rounded-lg border border-purple-400/40 bg-white text-black focus:ring-2 focus:ring-purple-400 placeholder-gray-500" placeholder="e.g., 150" />
              </div>
              <label className="flex items-center space-x-3">
                <input type="checkbox" checked={!!financial.hasDisability} onChange={(e)=>setFinancial({...financial, hasDisability:e.target.checked})} className="w-5 h-5 rounded text-purple-600" />
                <span className="text-purple-100">I have a disability</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" checked={!!financial.isPregnant} onChange={(e)=>setFinancial({...financial, isPregnant:e.target.checked})} className="w-5 h-5 rounded text-purple-600" />
                <span className="text-purple-100">Currently pregnant</span>
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

