import React, { useEffect, useState } from 'react';
import LoginImage from '../Media/Login-image.png';
import { Link } from 'react-router-dom';
// import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from 'react-google-login';
import { gapi } from 'gapi-script';


function Registration() {
  const navigate = useNavigate();
  
  const clientId = '880186097269-2246jg0fba0b6d3p0lov8b23a41g2nat.apps.googleusercontent.com';

  const [values, setValues] = useState({
    fullname: '',
    email: '',
    password: '',
  });

  

  const onSuccess = (res) => {
    console.log("LOGIN SUCCESSFUL! Current user:", res.profileObj);
    navigate("/LoginDashboard")
    
  };

  const onFailure = (res) => {
    console.log("LOGIN FAILED!", res);
    
  };

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: ""
      }).then(() => {
        console.log('GAPI client initialized.');
      }).catch((err) => {
        console.error('Error initializing GAPI client:', err);
      });
    }

    gapi.load('client:auth2', start);
  }, [clientId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/user/Register', values)
      .then(res => {
        if (res.data.Status === 'Success') {
          alert("Registration Successful");
          navigate('/Login');
        } else if (res.data.Error === 'User Already Exists') {
          alert("User Already Exists");
        } else {
          alert("Error during registration");
        }
      })
      .catch(err => {
        console.error(err);
        alert("Error during registration");
      });
  };

  return (
    <div className='Login w-screen h-screen flex'>
      <div className='Image-logo w-1/2 h-screen bg-red-100 flex items-center justify-center'>
        <img src={LoginImage} alt="Login" className='w-80 h-16' />
      </div>
      <div className='login-form-container w-1/2 h-screen flex items-center justify-center'>
        <form className='login-form bg-white p-8' onSubmit={handleSubmit}>
          <h2 className='text-2xl font-bold mb-6'>Register with AudioPress!</h2>
          <h4 className='p-2'>Already have an Account? <Link to='/Login'><b>Log In</b></Link></h4>

          {/* Google Login */}
          <GoogleLogin
            clientId={clientId}
            buttonText="Login with Google Account"
            onSuccess={onSuccess}
            onFailure={onFailure}
            cookiePolicy={'single_host_origin'}
            isSignedIn={true}
          >
            {/* <button className='w-80 flex items-center justify-evenly ml-2 m-2 p-2 shadow-xl border border-y-2 hover:bg-gray-200'>
              <FcGoogle /><b>Login with Google Account</b>
            </button> */}
          </GoogleLogin>

          <div className='input-field mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='full-name'>Full Name</label>
            <input
              type='text'
              id='full-name'
              name='fullname'
              className='w-full p-2 my-2 border border-gray-300 rounded'
              onChange={(e) => setValues({ ...values, fullname: e.target.value })}
            />
          </div>
          <div className='input-field mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>Email</label>
            <input
              type='email'
              id='email'
              name='email'
              className='w-full my-2 p-2 border border-gray-300 rounded'
              onChange={(e) => setValues({ ...values, email: e.target.value })}
            />
          </div>
          <div className='input-field mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>Password</label>
            <input
              type='password'
              id='password'
              name='password'
              className='w-full my-2 p-2 border border-gray-300 rounded'
              onChange={(e) => setValues({ ...values, password: e.target.value })}
            />
          </div>
          <button type='submit' className='w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition duration-200'>Submit</button>
        </form>
      </div>
    </div>
  );
}

export default Registration;
