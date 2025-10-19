import { motion } from 'framer-motion'

const EligibilityBadge = ({ eligible, estimatedAmount, reason, loading }) => {
  if (loading) {
    return (
      <div className="mt-4 p-3 bg-gray-100 rounded-lg animate-pulse">
        <div className="h-4 bg-gray-300 rounded w-24"></div>
      </div>
    )
  }

  if (eligible === null || eligible === undefined) {
    return (
      <div className="mt-4 p-3 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-600">Complete onboarding to see eligibility</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mt-4 p-4 rounded-lg border-2 ${
        eligible
          ? 'bg-green-50 border-green-200'
          : 'bg-red-50 border-red-200'
      }`}
    >
      <div className="flex items-center space-x-2 mb-2">
        <span className="text-2xl">{eligible ? '✅' : '❌'}</span>
        <span className={`font-bold text-lg ${
          eligible ? 'text-green-700' : 'text-red-700'
        }`}>
          {eligible ? 'Eligible' : 'Not Eligible'}
        </span>
      </div>
      
      {eligible && estimatedAmount > 0 && (
        <div className="mb-2">
          <p className="text-sm text-gray-600">Estimated Monthly Benefit:</p>
          <p className="text-2xl font-bold text-green-600">
            ${estimatedAmount.toFixed(2)}
          </p>
        </div>
      )}
      
      {reason && (
        <p className="text-sm text-gray-700 mt-2">
          <strong>Why:</strong> {reason}
        </p>
      )}
    </motion.div>
  )
}

export default EligibilityBadge

