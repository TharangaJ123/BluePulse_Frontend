import Home from './components/Home'
import Navbar from './components/Navbar.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import WaterTesting from './components/WaterSelecting'
import ServiceRequest from './components/ServiceRequest'
import WaterQuality from './components/WaterQuality'
import ServiceReqAdmin from './components/ServiceReqAdmin';

import './styles/styles.css';
import './index.css';


function App() {

  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/WaterTesting' element={<WaterTesting />} />
          <Route path='/ServiceRequest' element={<ServiceRequest />} />
          <Route path='/WaterQuality' element={<WaterQuality />} />
          <Route path="/waterQuality/:waterType" element={<WaterQuality />} />
          <Route path="/ServiceRequest/:ServiceReqAdmin" element={<ServiceReqAdmin />} />

        </Routes>
      </Router>
    </div>
  )
}

export default App
