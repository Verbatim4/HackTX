import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import StarterPage from './pages/StarterPage'
import LoginPage from './pages/LoginPage'
import OnboardingPage from './pages/OnboardingPage'
import Dashboard from './pages/Dashboard'
import HealthcarePage from './pages/HealthcarePage'
import HousingPage from './pages/HousingPage'
import FoodPage from './pages/FoodPage'
import TransportationPage from './pages/TransportationPage'
import SSIPage from './pages/SSIPage'
import ProfilePage from './pages/ProfilePage'

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth)
  return user ? children : <Navigate to="/login" />
}

function App() {
  const { i18n } = useTranslation()
  const { accessibility } = useSelector((state) => state.user)

  // Apply accessibility classes
  const accessibilityClasses = `
    ${accessibility?.fontSize ? `text-size-${accessibility.fontSize}` : ''}
    ${accessibility?.dyslexiaFont ? 'dyslexia-font' : ''}
    ${accessibility?.highContrast ? 'high-contrast' : ''}
    ${accessibility?.colorFilter && accessibility.colorFilter !== 'none' ? `filter-${accessibility.colorFilter}` : ''}
  `.trim()

  return (
    <div className={accessibilityClasses}>
      <Router>
        <Routes>
          <Route path="/" element={<StarterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <OnboardingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/healthcare"
            element={
              <ProtectedRoute>
                <HealthcarePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/housing"
            element={
              <ProtectedRoute>
                <HousingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/food"
            element={
              <ProtectedRoute>
                <FoodPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transportation"
            element={
              <ProtectedRoute>
                <TransportationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ssi"
            element={
              <ProtectedRoute>
                <SSIPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  )
}

export default App

