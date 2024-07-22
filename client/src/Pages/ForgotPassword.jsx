import React from 'react';
import LoginImage from '../Media/Login-image.png';
import {Link} from 'react-router-dom'
import Logo from '../Media/LandingPage/Logo.png' ; 
import { useState } from 'react';
import axios from 'axios' ; 


function ForgotPassword() {

const [email,setEmail] = useState('')

const handleForgotPassword=(e)=>{
  e.preventDefault() ; 
  axios.post('http://localhost:5000/api/user/ForgotPassword',{email}) 
  .then(res=>{
    if(res.data.Status==='Password reset email sent successfully!'){
      alert("Reset Password Link has been sent to your email ") 
    }
  }).catch(err=>console.log(err)) ; 
}


  return (
    <>
      <div className='Login w-screen h-screen flex'>
        <div className='Image-logo w-1/2 h-screen bg-red-100 flex items-center justify-center'>
          <img src={LoginImage} alt="Login" className='w-80 h-16' />
        </div>
        <div className='login-form-container w-1/2 h-screen flex items-center justify-center'>
          <form className='login-form bg-white p-8  w-96 ' onSubmit={handleForgotPassword}>
            
            <h2 className='text-2xl font-bold mb-6'>Forgot Password ? </h2>
            <h4 className='p-0'>Already have an Account? <Link to='/Login'><b>Log In</b></Link></h4>
            <div className='input-field mb-4'>
              <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>Enter your Registered Email</label>
              <input type='email' id='email' name='email' value={email} className='w-full my-2 p-2 border border-gray-300 rounded'  onChange={(e)=>setEmail(e.target.value)}/>
            </div>
            
            
            <button type='submit' className='w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition duration-200'>Submit</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
