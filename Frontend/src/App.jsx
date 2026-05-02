import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './features/auth/pages/LoginPage';
import SignupPage from './features/auth/pages/SignupPage';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import PracticePage from './features/practice/pages/PracticePage';
import AnalyticsPage from './features/dashboard/pages/AnalyticsPage';
import ResourcesPage from './features/dashboard/pages/ResourcesPage';
import InterviewPage from './features/interview/pages/InterviewPage';
import ProtectedRoute from './features/auth/components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
       <Routes>
          <Route path='/' element={<Navigate to='/login'/>}/>
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/signup' element={<SignupPage/>}/>
          
          <Route path="/dashboard"  element={<ProtectedRoute><DashboardPage/></ProtectedRoute>} />
          <Route path="/practice"   element={<ProtectedRoute><PracticePage/></ProtectedRoute>} />
          <Route path="/analytics"  element={<ProtectedRoute><AnalyticsPage/></ProtectedRoute>} />
          <Route path="/resources"  element={<ProtectedRoute><ResourcesPage/></ProtectedRoute>} />
          <Route path='/interview/:id' element={<ProtectedRoute><InterviewPage/></ProtectedRoute>}/>
       </Routes>
    </BrowserRouter>
  )
}

export default App
