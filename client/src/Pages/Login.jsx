import React from 'react';
import LoginImage from '../Media/Login-image.png';
import {Link} from 'react-router-dom'
// import { FcGoogle } from "react-icons/fc";
// import Logo from '../Media/LandingPage/Logo.png' ; 
import {useState} from 'react' ; 
import axios from 'axios' ; 
import { useNavigate } from 'react-router-dom';



function Login() {

const [values,setValues]=useState({
  email:'',
  password:'',
}) ; 

const navigate = useNavigate() ; 

//access cookies in frontend 
axios.defaults.withCredentials=true ; 



const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post('http://localhost:5000/api/user/Login', values);
    
    if (res.data.Status ==="Success") {
      alert("Welcome to AudioPress!");
     
      navigate("/LoginDashboard");
    
    } else if (res.data.Error === "User not found") {
      alert("User not found!");
    } else if (res.data.Error === "Password Does not match") {
      alert("Invalid Email or Password");
    } else {
      alert("Unexpected error!");
    }
  } catch (err) {
    console.log(err);
    alert("Error Logging In!");
  }
};

  return (
    <>
      <div className='Login w-screen h-screen flex'>
        <div className='Image-logo w-1/2 h-screen bg-red-100 flex items-center justify-center'>
          <img src={LoginImage} alt="Login" className='w-80 h-16' />
        </div>
        <div className='login-form-container w-1/2 h-screen flex items-center justify-center'>
          <form className='login-form bg-white p-8   ' onSubmit={handleSubmit}>
            
            <h2 className='text-2xl font-bold mb-6'>Welcome back to AudioPress! </h2>
            <h4 className='p-2'>Don't have an Account ? <Link to='/Register'><b>Register</b></Link></h4>
            <h4 className='p-2'>Cant Login  ? <Link to='/ForgotPassword'><b>Forgot Password</b></Link></h4>
           
            <div className='input-field mb-4'>
              <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>Email</label>
              <input type='email' id='email' className='w-full my-2 p-2 border border-gray-300 rounded' 
              onChange={(e)=>setValues({...values,email:e.target.value})}
              />
            </div>
            <div className='input-field mb-4'>
              <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>Password</label>
              <input type='password' id='password' className='w-full my-2 p-2 border border-gray-300 rounded' 
                  onChange={(e)=>setValues({...values,password:e.target.value})}/>
            </div>
            
            <button type='submit' className='w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition duration-200'>Submit</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
