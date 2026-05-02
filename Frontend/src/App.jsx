import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './features/auth/pages/LoginPage';
import SignupPage from './features/auth/pages/SignupPage';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import PracticePage from './features/practice/pages/PracticePage';
import AnalyticsPage from './features/dashboard/pages/AnalyticsPage';
import ResourcesPage from './features/dashboard/pages/ResourcesPage';
import InterviewPage from './features/interview/pages/InterviewPage';

function App() {
  return (
    <BrowserRouter>
       <Routes>
          <Route path='/' element={<Navigate to='/login'/>}/>
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/signup' element={<SignupPage/>}/>
          <Route path="/dashboard"  element={<DashboardPage/>} />
          <Route path="/practice"   element={<PracticePage/>} />
          <Route path="/analytics"  element={<AnalyticsPage/>} />
          <Route path="/resources"  element={<ResourcesPage/>} />
          <Route path='/interview/:id' element={<InterviewPage/>}/>
       </Routes>
    </BrowserRouter>
  )
}

export default App
