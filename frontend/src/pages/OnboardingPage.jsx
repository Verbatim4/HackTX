import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserProfile } from '../store/userSlice'

const OnboardingPage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const [step, setStep] = useState(1)
  const totalSteps = 5

  // Function to calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 0
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }

  // Form data
  const [formData, setFormData] = useState({
    dateOfBirth: '',
    maritalStatus: 'single',
    householdSize: 1,
    numberOfChildren: 0,
    currentIncome: '',
    employmentStatus: 'employed',
    totalWorkYears: '',
    employmentHistory: [],
    assets: '',
    monthlyRent: '',
    monthlyUtilities: '',
    hasDisability: false,
    isVeteran: user?.role === 'veteran',
    veteranServiceYears: '',
    medicalConditions: [],
    currentBenefits: [],
    isPregnant: false,
  })

  const [employmentEntry, setEmploymentEntry] = useState({
    employer: '',
    startYear: '',
    endYear: '',
    annualIncome: '',
  })

  const [medicalCondition, setMedicalCondition] = useState('')
  const [currentBenefit, setCurrentBenefit] = useState('')

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  const addEmploymentHistory = () => {
    if (employmentEntry.employer && employmentEntry.startYear && employmentEntry.annualIncome) {
      const yearsWorked = employmentEntry.endYear
        ? parseInt(employmentEntry.endYear) - parseInt(employmentEntry.startYear)
        : new Date().getFullYear() - parseInt(employmentEntry.startYear)
      
      setFormData({
        ...formData,
        employmentHistory: [
          ...formData.employmentHistory,
          { ...employmentEntry, yearsWorked },
        ],
      })
      setEmploymentEntry({ employer: '', startYear: '', endYear: '', annualIncome: '' })
    }
  }

  const addMedicalCondition = () => {
    if (medicalCondition.trim()) {
      setFormData({
        ...formData,
        medicalConditions: [...formData.medicalConditions, medicalCondition],
      })
      setMedicalCondition('')
    }
  }

  const addCurrentBenefit = () => {
    if (currentBenefit.trim()) {
      setFormData({
        ...formData,
        currentBenefits: [...formData.currentBenefits, currentBenefit],
      })
      setCurrentBenefit('')
    }
  }

  const handleSubmit = async () => {
    const age = calculateAge(formData.dateOfBirth)
    await dispatch(
      updateUserProfile({
        financialProfile: {
          ...formData,
          age: age,
          onboardingCompleted: true,
        },
      })
    )
    navigate('/dashboard')
  }

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-3xl bg-purple-900/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2 text-center">
          Welcome to Polara!
        </h1>
        <p className="text-purple-200 text-center mb-8">
          Let's gather some information to find the best benefits for you
        </p>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[...Array(totalSteps)].map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full mx-1 ${
                  i + 1 <= step ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-sm text-purple-200">
            Step {step} of {totalSteps}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Basic Information</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => updateField('dateOfBirth', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-purple-300 bg-white/90 focus:ring-2 focus:ring-purple-400"
                  />
                  {formData.dateOfBirth && (
                    <p className="text-sm text-purple-200 mt-1">
                      Age: {calculateAge(formData.dateOfBirth)} years old
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    Marital Status
                  </label>
                  <select
                    value={formData.maritalStatus}
                    onChange={(e) => updateField('maritalStatus', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-purple-300 bg-white/90 focus:ring-2 focus:ring-purple-400"
                  >
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    Household Size
                  </label>
                  <input
                    type="number"
                    value={formData.householdSize}
                    onChange={(e) => updateField('householdSize', parseInt(e.target.value))}
                    className="w-full px-4 py-3 rounded-lg border border-purple-300 bg-white/90 focus:ring-2 focus:ring-purple-400"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    Number of Children
                  </label>
                  <input
                    type="number"
                    value={formData.numberOfChildren}
                    onChange={(e) => updateField('numberOfChildren', parseInt(e.target.value))}
                    className="w-full px-4 py-3 rounded-lg border border-purple-300 bg-white/90 focus:ring-2 focus:ring-purple-400"
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.hasDisability}
                    onChange={(e) => updateField('hasDisability', e.target.checked)}
                    className="w-5 h-5 rounded text-purple-600"
                  />
                  <span className="text-purple-200">I have a disability</span>
                </label>

                {user?.role === 'veteran' && (
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">
                      Years of Military Service
                    </label>
                    <input
                      type="number"
                      value={formData.veteranServiceYears}
                      onChange={(e) => updateField('veteranServiceYears', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-purple-300 bg-white/90 focus:ring-2 focus:ring-purple-400"
                    />
                  </div>
                )}

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.isPregnant}
                    onChange={(e) => updateField('isPregnant', e.target.checked)}
                    className="w-5 h-5 rounded text-purple-600"
                  />
                  <span className="text-purple-200">Currently pregnant</span>
                </label>
              </div>
            </motion.div>
          )}

          {/* Step 2: Income & Employment */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-purple-900 mb-4">
                Income & Employment
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Annual Income ($)
                  </label>
                  <input
                    type="number"
                    value={formData.currentIncome}
                    onChange={(e) => updateField('currentIncome', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                    placeholder="50000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employment Status
                  </label>
                  <select
                    value={formData.employmentStatus}
                    onChange={(e) => updateField('employmentStatus', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="employed">Employed</option>
                    <option value="unemployed">Unemployed</option>
                    <option value="retired">Retired</option>
                    <option value="disabled">Disabled</option>
                    <option value="self-employed">Self-Employed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Years Worked
                  </label>
                  <input
                    type="number"
                    value={formData.totalWorkYears}
                    onChange={(e) => updateField('totalWorkYears', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                    placeholder="20"
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Employment History (Optional but helps with SSI calculation)
                </h3>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Employer"
                    value={employmentEntry.employer}
                    onChange={(e) =>
                      setEmploymentEntry({ ...employmentEntry, employer: e.target.value })
                    }
                    className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    type="number"
                    placeholder="Annual Income"
                    value={employmentEntry.annualIncome}
                    onChange={(e) =>
                      setEmploymentEntry({ ...employmentEntry, annualIncome: e.target.value })
                    }
                    className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    type="number"
                    placeholder="Start Year"
                    value={employmentEntry.startYear}
                    onChange={(e) =>
                      setEmploymentEntry({ ...employmentEntry, startYear: e.target.value })
                    }
                    className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    type="number"
                    placeholder="End Year (leave blank if current)"
                    value={employmentEntry.endYear}
                    onChange={(e) =>
                      setEmploymentEntry({ ...employmentEntry, endYear: e.target.value })
                    }
                    className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <button
                  onClick={addEmploymentHistory}
                  className="px-6 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
                >
                  Add Employment
                </button>

                {formData.employmentHistory.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {formData.employmentHistory.map((emp, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-lg text-sm">
                        <strong>{emp.employer}</strong> - ${emp.annualIncome}/year ({emp.startYear}
                        {emp.endYear ? `-${emp.endYear}` : '-Present'})
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 3: Housing & Assets */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-purple-900 mb-4">Housing & Assets</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Rent/Mortgage ($)
                  </label>
                  <input
                    type="number"
                    value={formData.monthlyRent}
                    onChange={(e) => updateField('monthlyRent', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                    placeholder="1200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Utilities ($)
                  </label>
                  <input
                    type="number"
                    value={formData.monthlyUtilities}
                    onChange={(e) => updateField('monthlyUtilities', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                    placeholder="150"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Assets ($)
                  </label>
                  <input
                    type="number"
                    value={formData.assets}
                    onChange={(e) => updateField('assets', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                    placeholder="Savings, investments, property value"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Include savings, investments, and property values
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Health & Medical */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-purple-900 mb-4">
                Health & Medical Conditions
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medical Conditions (Optional - helps with Medicaid eligibility)
                </label>
                <div className="flex space-x-2 mb-4">
                  <input
                    type="text"
                    value={medicalCondition}
                    onChange={(e) => setMedicalCondition(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addMedicalCondition()}
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., Diabetes, Hypertension"
                  />
                  <button
                    onClick={addMedicalCondition}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Add
                  </button>
                </div>

                {formData.medicalConditions.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.medicalConditions.map((condition, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                      >
                        {condition}
                        <button
                          onClick={() =>
                            updateField(
                              'medicalConditions',
                              formData.medicalConditions.filter((_, i) => i !== idx)
                            )
                          }
                          className="ml-2 text-purple-900 hover:text-red-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 5: Current Benefits */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-purple-900 mb-4">Current Benefits</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Are you currently receiving any benefits?
                </label>
                <div className="flex space-x-2 mb-4">
                  <input
                    type="text"
                    value={currentBenefit}
                    onChange={(e) => setCurrentBenefit(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCurrentBenefit()}
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., SNAP, Medicaid, Medicare"
                  />
                  <button
                    onClick={addCurrentBenefit}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Add
                  </button>
                </div>

                {formData.currentBenefits.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.currentBenefits.map((benefit, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                      >
                        {benefit}
                        <button
                          onClick={() =>
                            updateField(
                              'currentBenefits',
                              formData.currentBenefits.filter((_, i) => i !== idx)
                            )
                          }
                          className="ml-2 text-green-900 hover:text-red-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-8 p-6 bg-purple-50 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">
                  You're almost done!
                </h3>
                <p className="text-gray-700">
                  Based on the information you've provided, we'll show you all the benefits you
                  may qualify for and help you maximize your assistance.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {step < totalSteps ? (
            <button
              onClick={nextStep}
              className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Complete & View Benefits
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default OnboardingPage

