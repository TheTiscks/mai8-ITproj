import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import RoomDetailPage from './pages/RoomDetailPage'
import MyBookingsPage from './pages/MyBookingsPage'
import AnalyticsPage from './pages/AnalyticsPage';
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/rooms/:id" element={<RoomDetailPage />} />
      <Route path="/my-bookings" element={<MyBookingsPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
    </Routes>
  )
}

export default App
