import React,{ useState } from 'react'
import './App.css'
import FeedbackForm from './components/FeedbackForm'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <FeedbackForm/>
    </>
  )
}

export default App
