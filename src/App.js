import './App.css';
import LandingPage from './components/Homepage';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudyPlannerPage from './components/StudyPlanner';
import FocusTrackingPage from './components/FocusTracking';
import DashboardPage from './components/Dashboard';
import SmartStudyRecommendations from './components/SmartStudy';
import StudyGroups from './components/StudyGroups';
import SettingsPage from './components/Settings';

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path='/' element = {<LandingPage/>}/>
        <Route path='/studyplanner' element = {<StudyPlannerPage/>}/>
        <Route path='/focustracking' element = {<FocusTrackingPage/>}/>
        <Route path='/dashboard' element = {<DashboardPage/>}/>
        <Route path='/smartstudy' element = {<SmartStudyRecommendations/>}/>
        <Route path='/studygroups' element = {<StudyGroups/>}/>
        <Route path='/settings' element = {<SettingsPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
