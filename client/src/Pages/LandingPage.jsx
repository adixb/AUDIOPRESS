import React from 'react'
import Navbar from '../Components/Navbar' ;
import {Link} from 'react-router-dom' ;

function LandingPage() {
  return (
    <>
    <div className='Landing-Page w-screen h-screen '>
      <Navbar/>
      <hr></hr>
      <div className='Body flex flex-col items-center w-auto absolute m-auto  transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2'>
        <p className='text-7xl font-bold '>Your Voice , Your News</p>
        <p className='mt-5 text-xl font-semibold text-gray-700'>Your Personalised News Agreggator with AI Voice Assistant.</p>
        <span className='mt-7'><Link to='/Dashboard'><button className='border px-12 py-2 w-auto  text-white  bg-red-500 rounded-md hover:bg-red-300 hover:text-white'>GET STARTED FOR FREE</button></Link><Link to='/Login'><button className='border px-5 py-2 w-auto text-gray-700  rounded-md mx-2 hover:border-black'>LOGIN TO EXISTING ACCOUNT</button></Link></span>
      </div>
    </div>
    
    </>

  )
}

export default LandingPage ; 