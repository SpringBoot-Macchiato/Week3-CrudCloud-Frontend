import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Motores from './pages/Motores'
import Instancias from './pages/Instancias'
import DetalleInstancia from './pages/DetalleInstancia'
import MiPlan from './pages/MiPlan'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentPending from './pages/PaymentPending'
import PaymentFailure from './pages/PaymentFailure'
import DashboardLayout from './layouts/DashboardLayout'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <GoogleOAuthProvider clientId="298673093806-nnn4kq7860gtmqrh0pj775carg1nl6aj.apps.googleusercontent.com">
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Payment status routes */}
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/pending" element={<PaymentPending />} />
            <Route path="/payment/failure" element={<PaymentFailure />} />

            <Route path="/app" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/app/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="motores" element={<Motores />} />
              <Route path="instancias" element={<Instancias />} />
              <Route path="instancias/:id" element={<DetalleInstancia />} />
              <Route path="plan" element={<MiPlan />} />
            </Route>
          </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  )
}

export default App
