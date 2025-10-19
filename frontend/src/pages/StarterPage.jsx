import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const StarterPage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [stars, setStars] = useState([])

  useEffect(() => {
    // Generate random stars for background
    const newStars = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 3 + 2,
    }))
    setStars(newStars)
  }, [])

  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd < -75) {
      // Swipe right
      navigate('/login')
    }
  }

  const handleSwipe = () => {
    navigate('/login')
  }

  return (
    <div 
      className="min-h-screen gradient-bg relative overflow-hidden flex items-center justify-center"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Animated stars background */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Main content */}
      <motion.div
        className="relative z-10 text-center px-6"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        {/* POLARA Logo with star in O */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <h1 className="text-7xl md:text-9xl font-bold text-white tracking-wider">
            P
            <span className="relative inline-flex items-center justify-center mx-2 w-20 md:w-28">
              <span className="text-white">O</span>
              <svg
                className="absolute w-6 h-6 md:w-8 md:h-8"
                viewBox="0 0 24 24"
                fill="white"
              >
                {/* 4-pointed star (diamond/compass rose) */}
                <path d="M12 2 L15 12 L12 22 L9 12 Z M2 12 L12 9 L22 12 L12 15 Z" />
              </svg>
            </span>
            LARA
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="text-xl md:text-3xl text-white/90 font-light tracking-wide mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          {t('app.tagline')}
        </motion.p>

        {/* Swipe indicator */}
        <motion.div
          className="mt-20 cursor-pointer px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/30"
          onClick={handleSwipe}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex items-center justify-center space-x-3 text-white">
            <span className="text-xl font-medium">{t('auth.swipeToStart')}</span>
            <motion.svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </motion.svg>
          </div>
          <p className="text-sm text-white/60 mt-2 text-center">Swipe right or click to continue</p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default StarterPage

