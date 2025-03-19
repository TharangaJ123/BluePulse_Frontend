import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div >
        <Link to='/waterTesting'>
            <h1 className='text-black'></h1>
        </Link>
        <Link to='/ServiceRequest'>
            <h1 className='text-black'></h1>
        </Link>
        <Link to='/WaterQuality'>
            <h1 className='text-black'></h1>
        </Link>
    
        
    </div>
  )
}

export default Navbar