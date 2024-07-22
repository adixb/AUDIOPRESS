import React from 'react';
import LoginImage from '../Media/Login-image.png';

import Logo from '../Media/LandingPage/Logo.png' ; 
import { useState } from 'react';
import axios from 'axios' ; 
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


function ForgotPassword() {

const [password,setPassword] = useState('')
const [confirmPassword,setConfirmPassword]=useState('')

const {token} = useParams() ; 
const navigate =useNavigate() ; 

const handleResetPassword=(e)=>{

  e.preventDefault() ; 
  if(password===confirmPassword){
  axios.post(`http://localhost:5000/api/user/ResetPassword/${token}`,{password}) 
  .then(res=>{
    if(res.data.Status==='Password Changed Successfully!'){
        alert('Password Updated Successfully!')
        navigate('/Login'); 
    }
  }).catch(err=>{
    alert("Unable to update password") ; 
    console.log(err) ; 
  })
  }

}


  return (
    <>
      <div className='Login w-screen h-screen flex'>
        <div className='Image-logo w-1/2 h-screen bg-red-100 flex items-center justify-center'>
          <img src={LoginImage} alt="Login" className='w-80 h-16' />
        </div>
        <div className='login-form-container w-1/2 h-screen flex items-center justify-center'>
          <form className='login-form bg-white p-8  w-96 ' onSubmit={handleResetPassword}>
            
            <h2 className='text-2xl font-bold mb-6'> Create a new password </h2>
            
            <div className='input-field mb-4'>
              <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>Enter a new Password</label>
              <input type='password' id='password' name='password' value={password} className='w-full my-2 p-2 border border-gray-300 rounded'  onChange={(e)=>setPassword(e.target.value)}/>
            </div>
            <div className='input-field mb-4'>
              <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>Confirm Your Password</label>
              <input type='Password' id='confirmPassword' name='confirmPassword' value={confirmPassword} className='w-full my-2 p-2 border border-gray-300 rounded'  onChange={(e)=>setConfirmPassword(e.target.value)}/>
            </div>
            
            
            <button type='submit' className='w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition duration-200'>Update Password</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
