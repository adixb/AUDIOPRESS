const express = require('express') ; 
const {handleFetchNews} = require('../Controllers/News') ; 
const {handleWebhookNews} = require ('../Controllers/News') ; 


const router = express.Router() ; 


//GET ROUTES 
router.post('/getNews',handleFetchNews) ; 


// POST ROUTES 




//PUT ROUTES 



//DELETE ROUTES




module.exports = router ; 