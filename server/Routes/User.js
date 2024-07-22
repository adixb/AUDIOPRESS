//imports
const express = require('express') ; 

//controllers
const {handleServer} = require('../Controllers/User')
const {handleSignup} = require('../Controllers/User')
const {handleLogin} = require('../Controllers/User')
const {handleLogout} = require('../Controllers/User')
const {handleFetchUserDetails} = require('../Controllers/User')
const {handleUpdateUserDetails} = require('../Controllers/User')
const {handleForgotPassword} = require('../Controllers/User')
const {handleResetPassword} = require('../Controllers/User')
const {handleProfilePictureUpdate} = require('../Controllers/User')
const {handleDeleteProfilePicture} = require('../Controllers/User') ; 

//middlewares
const {verifytoken} = require('../Middlewares/User') ; 
const upload = require('../Middlewares/MulterConfig') ; 


const router = express.Router() ; 


// GET ROUTES
router.get('/',handleServer) ; 
router.get('/Logout',handleLogout)
router.get('/UserDetails', verifytoken, handleFetchUserDetails) 

//POST ROUTES
router.post('/Register',handleSignup)
router.post('/Login',handleLogin)
router.post('/ForgotPassword',handleForgotPassword)
router.post('/ResetPassword/:token',handleResetPassword)
router.post('/ProfilePictureUpdate',verifytoken,upload.single('file'),handleProfilePictureUpdate)

//DELETE ROUTES 
router.delete('/DelProfilePic',verifytoken,handleDeleteProfilePicture) ; 

//PUT-UPADTE ROUTES 
router.put('/Update',verifytoken,handleUpdateUserDetails)

module.exports = router ; 