import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getBenefitsByCategory } from '../store/benefitsSlice'
import AlertsPanel from '../components/AlertsPanel'
import EligibilityBadge from '../components/EligibilityBadge'
import axios from 'axios'

const HealthcarePage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { benefits, loading } = useSelector((state) => state.benefits)
  const { token } = useSelector((state) => state.auth)
  const [eligibility, setEligibility] = useState({})
  const [eligibilityLoading, setEligibilityLoading] = useState(true)

  useEffect(() => {
    dispatch(getBenefitsByCategory('healthcare'))
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

  const benefitEligibilityMap = {
    'medicaid': 'medicaid',
    'medicare': 'medicare',
    'aca-subsidies': 'acaSubsidies',
    'tricare': 'tricare',
    'va-health': 'vaHealth',
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
          <h1 className="text-3xl font-bold text-white">{t('benefits.healthcare.title')}</h1>
        </div>
        <AlertsPanel />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-12">
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
                  className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
                      🏥
                    </div>
                    <h3 className="text-xl font-bold text-purple-900">{benefit.name}</h3>
                  </div>
                  <p className="text-gray-700 mb-4">{benefit.description}</p>
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-purple-700 mb-1">Eligibility:</p>
                    <p className="text-sm text-gray-600">{benefit.eligibility}</p>
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
          <div className="mt-8 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-2xl">
            <p className="text-yellow-800 text-center">
              <strong>Complete your onboarding</strong> to see which benefits you qualify for!
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

export default HealthcarePage
