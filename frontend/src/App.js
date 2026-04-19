// frontend/src/App.js
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import SplashPage from './pages/SplashPage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import MessagesPage from './pages/MessagesPage';
import PostPage from './pages/PostPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import EditPost from './pages/EditPost';
import AdminDashboard from './pages/AdminDashboard';
import AdminProfile from './pages/AdminProfile';
import AdminMessages from './pages/AdminMessages';
import WritePost from './pages/WritePost';
import UserProfile from './pages/UserProfile';
function App() {
 return (
 <>
 <Navbar />
 <Routes>
 {/* Public routes — anyone can visit */}
 <Route path='/' element={<SplashPage />} />
 <Route path='/home' element={<HomePage />} />
 <Route path='/about' element={<AboutPage />} />
 <Route path='/contact' element={<ContactPage />} />
 <Route path='/messages' element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
 <Route path='/posts/:id' element={<PostPage />} />
 <Route path='/login' element={<LoginPage />} />
 <Route path='/register' element={<RegisterPage />} />
 <Route path='/forgot-password' element={<ForgotPasswordPage />} />
 
 {/* Protected routes — must be logged in */}
 <Route path='/profile' element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
 <Route path='/write' element={<ProtectedRoute><WritePost /></ProtectedRoute>} />
 <Route path='/create-post' element={<ProtectedRoute><WritePost /></ProtectedRoute>} />
 <Route path='/edit-post/:id' element={<ProtectedRoute><EditPost /></ProtectedRoute>} />
 
 {/* Admin only routes */}
 <Route path='/admin' element={<ProtectedRoute role='admin'><AdminDashboard /></ProtectedRoute>} />
 <Route path='/admin/dashboard' element={<ProtectedRoute role='admin'><AdminDashboard /></ProtectedRoute>} />
 <Route path='/admin/profile' element={<ProtectedRoute role='admin'><AdminProfile /></ProtectedRoute>} />
 <Route path='/admin/messages' element={<ProtectedRoute role='admin'><AdminMessages /></ProtectedRoute>} />
 </Routes>
 </>
 );
}
export default App;
