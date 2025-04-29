import React, { useState } from 'react';
import './App.css';
import FeedbackForm from './components/FeedbackForm';
import CommunitySection from './components/CommunitySection';
import Testing from './components/Testing';
import Thank from './components/Thank';
import CommunityPost from './components/CommunityPost';
import UpdateFeedback from './components/UpdateFeedback';
import AdminFeed from './components/AdminFeed';
import AdminCommi from './components/AdminCommi';
import Updatecommi from './components/Updatecommi';


import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<FeedbackForm />} />
        <Route path="/community" element={<CommunitySection />} />
        <Route path="/testing" element={<Testing />} />
        <Route path="/thank" element={<Thank />} />
        <Route path="/community-post/:id" element={<CommunityPost />} />
        <Route path="/update-feedback" element={<UpdateFeedback />} />
        <Route path="/AdminFeed" element={<AdminFeed />} />
       < Route path="/AdminCommi" element={<AdminCommi/>} />
       <Route path="/Updatecommi" element={<Updatecommi />} />
      </Routes>
    </Router>
  );
}

export default App;