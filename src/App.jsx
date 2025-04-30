import React,{ useState } from 'react'
import './App.css';
import FinanceAdmin from './components/FinanceAdmin';
import WaterResourceFinanceForm from './components/WaterResourceFinanceForm';
import PaymentSuccessPage from './components/PaymentSuccessPage';
import {BrowserRouter as Router,Route,Routes} from "react-router-dom"
function App() {
  const [count, setCount] = useState(0)

  return ( 
  <Router>
    <div>
      <Routes>
        <Route path="/admin" element={<FinanceAdmin />} />
        <Route path="/" element={<WaterResourceFinanceForm />} />
        <Route path="/success" element={<PaymentSuccessPage />} />
      </Routes>
    </div>
  </Router>
  )
}

export default App
