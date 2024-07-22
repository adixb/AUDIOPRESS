import React from 'react'
import Logo from '../Media/LandingPage/Logo.png' ; 
import { Link } from 'react-router-dom';

function About() {
  return (
    <>
    <div className='About w-screen h-screen overflow-x-hidden '>
        
        <div className='w-full h-full'>
       <Link to='/'> <span className='text-2xl font-bold flex items-center gap-2 p-24 flex items-center justify-center   bg-red-300 '><img src={Logo} className='w-7 h-7'></img>AudioPress
        </span></Link>
        <p className='text-2xl p-7 font-semibold '>
      

Welcome to AudioPress, your intelligent voice assistant for all things news! 

AudioPress is a cutting-edge AI-powered news aggregator designed to deliver the latest headlines and in-depth analysis directly to you through a seamless voice experience. Whether you’re commuting, working out, or relaxing at home, AudioPress ensures you stay informed with personalized news updates tailored to your interests.
<br></br>
<br></br>
<br></br>

<b>Key Features:</b>
<br/>

<b>Personalized News Feed:</b> AudioPress learns your preferences and curates news stories that matter most to you, providing a customized listening experience.
<br/>
<br/>
<b>Real-time Updates:</b> Stay ahead with instant news alerts and breaking stories as they happen, keeping you informed in real time.
<br/>
<br/>
<b>Diverse Sources:</b> Access a wide range of news from trusted global sources, ensuring balanced and comprehensive coverage on every topic.
<br/>
<br/>
<b>Voice Commands:</b> Easily navigate and control your news experience with simple voice commands, making it convenient to get the news hands-free.
<br/>
<br/>
<br/>


At AudioPress, we believe in the power of informed communities. Our mission is to make staying updated effortless and enjoyable, providing you with the news you need, whenever you need it. Join the AudioPress community today and transform the way you experience news.
        </p>
        <span className='flex items-center justify-center mt-12 text-gray-500'>©️Developed by Aditya Bhattacharjee 2024</span>
        </div>
    </div>
    
    </>
  )
}

export default About