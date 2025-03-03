import React,{ useState } from 'react'
import './App.css'
import Payments from './components/payments'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Payments/>
    </>
  )
}

export default App
