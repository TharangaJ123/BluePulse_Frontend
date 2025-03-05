import React,{ useState } from 'react'
import './App.css'
import FeedbackForm from './components/FeedbackForm'
import CommunitySection from './components/CommunitySection'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <FeedbackForm/>
      <CommunitySection/>
    </>
  )
}



export default App
