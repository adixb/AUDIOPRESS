import React from 'react'
import Logo from '../Media/LandingPage/Logo.png' ; 
import { Link } from 'react-router-dom';
// import aboutvid from '../Media/abot.mp4';

function About() {
  return (
    <>
    <div className='About w-screen h-screen overflow-x-hidden '>
        
        <div className='w-full h-full'>
       <Link to='/'> <span className='text-2xl font-bold flex items-center gap-2 p-24 flex items-center justify-center   bg-red-300 '><img src={Logo} className='w-7 h-7'></img>AudioPress
        </span></Link>
        <p className='text-5xl p-7  font-semibold mt-48 text-center flex flex-col items-center justify-center'>
      

Welcome to AudioPress, your  voice assistant for all things news! 

AudioPress is a cutting-edge  news aggregator designed to deliver the latest headlines and in-depth analysis directly to you through a seamless voice experience. Whether you’re commuting, working out, or relaxing at home, AudioPress ensures you stay informed with personalized news updates tailored to your interests.
<br></br>
<br></br>
<br></br>



{/* <video className='w-[100vw] h-[50dvh] rounded' loop autoPlay muted src={aboutvid}></video> */}

        </p>
        <span className='flex items-center justify-center mt-16 text-gray-500'>©️Developed by Aditya Bhattacharjee 2024</span>
        </div>
    </div>
    
    </>
  )
}

export default About