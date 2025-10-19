import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { login, register } from '../store/authSlice'

const LoginPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { loading, error } = useSelector((state) => state.auth)

  // Login form state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Register form state
  const [registerName, setRegisterName] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [role, setRole] = useState('retired')
  const [state, setState] = useState('TX')

  const handleLogin = async (e) => {
    e.preventDefault()
    const result = await dispatch(login({ email: loginEmail, password: loginPassword }))
    if (result.type === 'auth/login/fulfilled') {
      navigate('/dashboard')
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    const result = await dispatch(
      register({
        name: registerName,
        email: registerEmail,
        password: registerPassword,
        role,
        state,
      })
    )
    if (result.type === 'auth/register/fulfilled') {
      navigate('/onboarding')
    }
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      {/* POLARA Logo */}
      <div className="absolute top-8 left-8 text-white text-3xl font-bold tracking-wider">
        P
        <span className="relative inline-flex items-center justify-center mx-1 w-8 h-8">
          <span className="text-white">O</span>
          <svg
            className="absolute w-3 h-3"
            viewBox="0 0 24 24"
            fill="white"
          >
            {/* 4-pointed star (diamond/compass rose) */}
            <path d="M12 2 L15 12 L12 22 L9 12 Z M2 12 L12 9 L22 12 L12 15 Z" />
          </svg>
        </span>
        LARA
      </div>


      {/* Split Screen Container */}
      <motion.div
        className="w-full max-w-6xl bg-purple-900/30 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid md:grid-cols-2 divide-x divide-white/10">
          {/* Left Side - Sign In */}
          <div className="p-12">
            <h2 className="text-4xl font-semibold text-white mb-8">{t('auth.signIn')}</h2>
            <form onSubmit={handleLogin} className="space-y-6">
              <input
                type="email"
                placeholder={t('auth.email')}
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-6 py-4 rounded-full bg-white/80 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
              <input
                type="password"
                placeholder={t('auth.password')}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-6 py-4 rounded-full bg-white/80 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
              <motion.button
                type="submit"
                className="w-full py-4 rounded-full bg-pink-200 text-purple-900 font-semibold hover:bg-pink-300 transition-colors disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
              >
                {t('auth.secureLogin')}
              </motion.button>
            </form>
            <div className="mt-6 flex justify-between text-white/80 text-sm">
              <button className="hover:text-white transition-colors">
                {t('auth.forgotPassword')}
              </button>
              <button className="hover:text-white transition-colors">
                {t('auth.loginWithGoogle')}
              </button>
            </div>
            {error && <div className="mt-4 text-red-300 text-sm text-center">{error}</div>}
          </div>

          {/* Right Side - Create Account */}
          <div className="p-12">
            <h2 className="text-4xl font-semibold text-white mb-8">{t('auth.createAccount')}</h2>
            <form onSubmit={handleRegister} className="space-y-6">
              <input
                type="text"
                placeholder={t('auth.fullName')}
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                className="w-full px-6 py-4 rounded-full bg-white/80 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
              <input
                type="email"
                placeholder={t('auth.email')}
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                className="w-full px-6 py-4 rounded-full bg-white/80 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
              <input
                type="password"
                placeholder={t('auth.createPassword')}
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                className="w-full px-6 py-4 rounded-full bg-white/80 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-6 py-4 rounded-full bg-white/80 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              >
                <option value="retired">Retired</option>
                <option value="disabled">Disabled</option>
                <option value="veteran">Veteran</option>
              </select>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-6 py-4 rounded-full bg-white/80 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              >
                <option value="TX">Texas</option>
                <option value="CA">California</option>
                <option value="NY">New York</option>
                <option value="FL">Florida</option>
                {/* Add more states as needed */}
              </select>
              <motion.button
                type="submit"
                className="w-full py-4 rounded-full bg-pink-200 text-purple-900 font-semibold hover:bg-pink-300 transition-colors disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
              >
                {t('auth.joinUs')}
              </motion.button>
            </form>
            <p className="mt-6 text-white/70 text-xs text-center">{t('auth.termsAgreement')}</p>
          </div>
        </div>
      </motion.div>

      {/* Tagline at bottom */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 text-lg">
        {t('app.tagline')}
      </div>
    </div>
  )
}

export default LoginPage

