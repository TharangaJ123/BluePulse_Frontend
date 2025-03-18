import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div >
        <Link to='/waterTesting'>
            <h1 className='text-black'>Select a water Type</h1>
        </Link>
        <Link to='/ServiceRequest'>
            <h1 className='text-black'>Request a service</h1>
        </Link>
        <Link to='/WaterQuality'>
            <h1 className='text-black'>Water Quality Testing</h1>
        </Link>
    
        
    </div>
  )
}

export default Navbar