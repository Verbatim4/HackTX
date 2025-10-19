import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getAlerts, markAlertViewed } from '../store/alertsSlice'

const AlertsPanel = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { alerts, unreadCount } = useSelector((state) => state.alerts)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    dispatch(getAlerts())
  }, [dispatch])

  const handleAlertClick = (alertId) => {
    dispatch(markAlertViewed(alertId))
  }

  const getAlertIcon = (type) => {
    switch (type) {
      case 'income_change':
        return '💰'
      case 'rule_update':
        return '📋'
      case 'benefit_adjustment':
        return '📈'
      default:
        return '🔔'
    }
  }

  return (
    <>
      {/* Notification Bell */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg flex items-center justify-center relative"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={t('alerts.title')}
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </motion.button>

      {/* Alerts Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed top-20 right-8 w-96 max-h-[600px] bg-purple-900/95 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden z-40"
          >
            <div className="p-6">
              <h3 className="text-2xl font-bold text-white mb-4">{t('alerts.title')}</h3>
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {alerts.length === 0 ? (
                  <p className="text-purple-200 text-center py-8">{t('alerts.noAlerts')}</p>
                ) : (
                  alerts.map((alert) => (
                    <motion.div
                      key={alert._id}
                      onClick={() => handleAlertClick(alert._id)}
                      className={`p-4 rounded-xl cursor-pointer transition-colors ${
                        alert.viewed
                          ? 'bg-purple-800/50 hover:bg-purple-800'
                          : 'bg-purple-700/50 hover:bg-purple-700'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{getAlertIcon(alert.type)}</span>
                        <div className="flex-1">
                          <p
                            className={`font-medium ${
                              alert.viewed ? 'text-purple-200' : 'text-white'
                            }`}
                          >
                            {alert.message}
                          </p>
                          {alert.impactValue !== 0 && (
                            <p className="text-sm text-green-600 mt-1">
                              Impact: ${Math.abs(alert.impactValue)}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(alert.dateIssued).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default AlertsPanel

