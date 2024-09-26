const express = require('express') ; 
const {handleFetchNews} = require('../Controllers/News') ; 
const {handleWebhookNews} = require ('../Controllers/News') ; 


const router = express.Router() ; 


//POST ROUTES 
router.post('/getNews',handleFetchNews) ; 


// GET ROUTES 




//PUT ROUTES 



//DELETE ROUTES




module.exports = router ; 