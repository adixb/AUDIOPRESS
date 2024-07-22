import React from 'react'
import { Routes,Route } from 'react-router-dom';
import LandingPage from '../Pages/LandingPage';
import Registration from '../Pages/Registration';
import Login from '../Pages/Login';
import ForgotPassword from '../Pages/ForgotPassword';
import ResetPassword from '../Pages/ResetPassword' ; 
import About from '../Pages/About' ;
import DashBoard  from '../Pages/DashBoard';
import LoginDashBoard from '../Pages/LoginDashboard';


function AllRoutes() {
  return (
    <>
    <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/Login' element={<Login/>}/>
        <Route path='/Register' element={<Registration/>}/>
        <Route path='/ForgotPassword' element={<ForgotPassword/>}/>
        <Route path='/ResetPassword/:token' element={<ResetPassword/>}/>
        <Route path='/About' element={<About/>}/>
        <Route path='/Dashboard' element={<DashBoard/>}/>
        <Route path='/LoginDashboard' element={<LoginDashBoard/>}/>
     
    </Routes>

    </>
  )
}

export default AllRoutes