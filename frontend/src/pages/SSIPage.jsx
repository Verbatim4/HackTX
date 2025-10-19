import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getBenefitsByCategory, calculateBenefit } from '../store/benefitsSlice'
import { getUserProfile } from '../store/userSlice'
import AlertsPanel from '../components/AlertsPanel'
import EligibilityBadge from '../components/EligibilityBadge'
import axios from 'axios'

const SSIPage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { benefits, loading, calculationResult } = useSelector((state) => state.benefits)
  const { token } = useSelector((state) => state.auth)
  const { profile } = useSelector((state) => state.user)

  const [eligibility, setEligibility] = useState({})
  const [eligibilityLoading, setEligibilityLoading] = useState(true)

  const [income, setIncome] = useState('')
  const [children, setChildren] = useState(0)
  const [calculating, setCalculating] = useState(false)

  useEffect(() => {
    dispatch(getBenefitsByCategory('ssi'))
    dispatch(getUserProfile())
    fetchEligibility()
  }, [dispatch])

  const fetchEligibility = async () => {
    try {
      const response = await axios.get('/api/eligibility', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setEligibility(response.data)
      setEligibilityLoading(false)
    } catch (error) {
      console.error('Error fetching eligibility:', error)
      setEligibilityLoading(false)
    }
  }

  const handleCalculateEITC = async () => {
    setCalculating(true)
    await dispatch(
      calculateBenefit({
        type: 'eitc',
        income: parseFloat(income),
        children: parseInt(children),
        filingStatus: 'single',
      })
    )
    setCalculating(false)
  }

  const benefitEligibilityMap = {
    'ssi': 'ssi',
    'ssdi': 'ssdi',
    'eitc': 'eitc',
    'ctc': 'ctc',
    'tanf': 'tanf',
  }

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
          <h1 className="text-3xl font-bold text-white">{t('benefits.ssi.title')}</h1>
        </div>
        <AlertsPanel />
      </div>

      {/* Total Benefits Summary */}
      <div className="container mx-auto px-6 pt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-yellow-500/30 to-orange-500/40 backdrop-blur-sm rounded-2xl p-6 shadow-xl mb-8 border border-yellow-400/20"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl">
                ☀️
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Total SSI & Tax Benefits</h2>
                <p className="text-yellow-200">Your monthly SSI and tax benefit amount</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-white">
                ${(profile?.benefits?.ssi || 0).toLocaleString()}
              </div>
              <div className="text-yellow-200 text-sm">per month</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 pb-12">
        {/* Calculator Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl mb-8"
        >
          <h2 className="text-2xl font-bold text-purple-900 mb-6">Quick EITC Calculator</h2>
          <p className="text-gray-600 mb-4">
            For accurate SSI/SSDI calculations, your employment history from onboarding is used.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Income ($)
              </label>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your income"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Children
              </label>
              <input
                type="number"
                value={children}
                onChange={(e) => setChildren(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="0"
                min="0"
              />
            </div>
          </div>
          <motion.button
            onClick={handleCalculateEITC}
            disabled={calculating || !income}
            className="mt-6 px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {calculating ? 'Calculating...' : t('common.calculate')}
          </motion.button>

          {calculationResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 p-6 bg-green-50 rounded-lg border-2 border-green-200"
            >
              <h3 className="text-xl font-bold text-green-800 mb-2">Your Estimated EITC:</h3>
              <p className="text-3xl font-bold text-green-600">
                ${calculationResult.amount?.toFixed(2) || '0.00'}
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Benefits List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-white text-xl">{t('common.loading')}</div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const eligibilityKey = benefitEligibilityMap[benefit.id]
              const eligibilityData = eligibility[eligibilityKey]

              return (
                <motion.div
                  key={benefit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-purple-900/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-2xl">
                      💰
                    </div>
                    <h3 className="text-xl font-bold text-white">{benefit.name}</h3>
                  </div>
                  <p className="text-purple-200 mb-4">{benefit.description}</p>
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-purple-300 mb-1">Eligibility:</p>
                    <p className="text-sm text-purple-200">{benefit.eligibility}</p>
                  </div>

                  {/* Eligibility Badge */}
                  {eligibilityData && (
                    <EligibilityBadge
                      eligible={eligibilityData.eligible}
                      estimatedAmount={eligibilityData.estimatedAmount}
                      reason={eligibilityData.reason}
                      loading={eligibilityLoading}
                    />
                  )}

                  <a
                    href={benefit.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    {t('common.learnMore')}
                  </a>
                </motion.div>
              )
            })}
          </div>
        )}

        {!eligibilityLoading && Object.keys(eligibility).length === 0 && (
          <div className="mt-8 p-6 bg-yellow-900/50 border-2 border-yellow-600 rounded-2xl">
            <p className="text-yellow-200 text-center">
              <strong>Complete your onboarding with employment history</strong> to see accurate SSI/SSDI eligibility!
            </p>
            <button
              onClick={() => navigate('/onboarding')}
              className="mt-4 mx-auto block px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium"
            >
              Complete Onboarding
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SSIPage
