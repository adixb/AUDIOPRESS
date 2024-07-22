import React from 'react'
import Logo from '../Media/LandingPage/Logo.png' ; 
import {Link} from 'react-router-dom' ;

function Navbar() {
  return (
   <>
   <nav className=' flex items-center justify-between'>
    <ul className=' flex  items-center p-4'>
   <li className='mx-2'><Link to="/"><span className='text-2xl font-bold flex items-center gap-2 m-2'><img src={Logo} className='w-7 h-7'></img>AudioPress</span></Link></li>
    <li className='font-sans mx-5  text-gray-500 mt-2 hover:text-black cursor-pointer'><Link to='/About'>About</Link></li>
    <li className='font-sans  text-gray-500 mt-2 hover:text-black cursor-pointer'><a href="https://github.com/Adi0706" target="_blank">Developer Github</a></li>
    <li className='font-sans  text-gray-500 mt-2 hover:text-black cursor-pointer mx-5'><a href="https://app.eraser.io/workspace/mnWaBWywsjsJowC6hton?origin=share" target="_blank">Project Timeline and Tasks</a></li>
    </ul>
    <ul className=' flex  items-center  mr-12 p-4 '>
    <li><Link to='/Login'><button className='border px-5 py-2 w-auto text-gray-700  rounded-md mx-2 hover:border-black'>LOG IN</button></Link></li>
        
    <Link to='/Dashboard'><li><button className='border px-12 py-2 w-auto text-white  bg-red-500 rounded-md hover:bg-red-300 hover:text-white'>GET STARTED FOR FREE</button></li></Link>

    </ul>
   </nav>
   </>
  )
}

export default Navbar ; 