const { sqlConnection } = require('../Connection/sqlConnection');
const bcrypt = require('bcrypt');
const saltRounds = 10; // Number of salt rounds for bcrypt
const cookieParser = require('cookie-parser') ; 
const jwt = require('jsonwebtoken') ; 
const dotenv = require('dotenv') ; 
const nodemailer = require("nodemailer") ; 
const multer = require('multer')
const path=require('path');
const { error } = require('console');




dotenv.config() ; 

const jwt_secret_key = process.env.JWT_SECRET_KEY ; 
const email_jwt_key  = process.env.EMAIL_SECRET_KEY ; 
const google_app_password = process.env.GOOGLE_APP_PASSWORD

async function handleServer(req, res) {
    return res.send("hello this is server");
}

// USER SIGNUP 
async function handleSignup(req, res) {
    const { fullname, email, password } = req.body; // get the values from body first  
    try {
        const dbConnection = await sqlConnection();

        // Check if the user already exists
        const checkUserSql = 'SELECT email FROM USER_SIGNUP WHERE email=?';
        dbConnection.query(checkUserSql, [email], async (err, result) => {
            if (err) {
                console.error("Error checking user existence:", err);
                return res.json({ Error: "Error in checking user existence" });
            }
            
            if (result.length > 0) {
                // User already exists
                return res.json({ Error: "User Already Exists" });
            }

            try {
                // Hash the password
                const hashedPassword = await bcrypt.hash(password.toString(), saltRounds);
                // const _id=uuidv4() ; 
                const values = [fullname, email, hashedPassword];

                // Insert the new user
                const newUserSql = 'INSERT INTO USER_SIGNUP (fullname, email, password) VALUES (?, ?, ?)';
                dbConnection.query(newUserSql, values, (err, result) => {
                    if (err) {
                        console.error("Error inserting data:", err);
                        return res.json({ Error: "Error in inserting data" });
                    }
                    console.log("Number of records inserted: " + result.affectedRows);
                    return res.json({ Status: "Success" });
                });
            } catch (hashError) {
                console.error("Error hashing password:", hashError);
                return res.json({ Error: "Error hashing password" });
            }
        });
    } catch (error) {
        console.error("Error connecting to database:", error);
        return res.json({ Error: 'Internal Server Error' });
    }
}
//LOGIN USER 
async function handleLogin(req, res) {
    const loginUser = 'SELECT * FROM USER_SIGNUP WHERE email=?';
    const value = req.body.email;

    try {
        const dbConnection = await sqlConnection();

        dbConnection.query(loginUser, value, (err, result) => {
            if (err) {
                console.error("Database query error:", err);
                return res.status(500).json({ Error: "Unexpected Error" });
            }

            if (result.length > 0) {
                // email exists
                // check password matches the database or not 
                bcrypt.compare(req.body.password.toString(), result[0].password, (err, isMatch) => {
                    if (err) {
                        console.error("Password comparison error:", err);
                        return res.status(500).json({ Error: "Unexpected error in comparing password" });
                    }
                    if (isMatch) {
                        // password matches 
                        //generating jwt token if login is successfull --sending full name and emal in the token 

                        const name  = result[0].fullname ; 
                        const email = result[0].email ; 
                        const _id = result[0].id;
                        const token = jwt.sign({_id,name,email},jwt_secret_key,{expiresIn:'1d'})
                        res.cookie('token',token) ; //generating the token which expires in 1 day . 

                        return res.status(200).json({ Status: "Success" });
                    } else {
                        return res.status(401).json({ Error: "Password does not match" });
                    }
                });
            } else {
                return res.status(404).json({ Error: "User not found" });
            }
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({ Error: "Unexpected Error" });
    }
}
//LOGOUT USER
async function handleLogout(req,res){
    res.clearCookie('token');
    return res.json({Status:"Success"})
}
//FETCH USER DETAILS
const handleFetchUserDetails = async (req, res) => {
    const { email } = req.user; // Assuming req.user contains the authenticated user's details

    try {
        const dbConnection = await sqlConnection();
        const getDetailsQuery = 'SELECT fullname, email, img_url FROM USER_SIGNUP WHERE email = ?';
        
        // Execute the query with email as parameter
       dbConnection.query(getDetailsQuery,[email],(err,data)=>{
        if(err){
            console.error('Error in fetching details !',err) ;
            return res.status(500).json({error:"Error fetching details"}) ;  
        }
        if(data.length>0){
            const user = data[0] ; 
            return res.status(200).json({fullname:user.fullname , email:user.email,img_url:user.img_url}) ; 
        }else {
            return res.status(404).json({error:"User not found"}) ;
        }
       })
    } catch (err) {
        console.error("Error fetching details:", err);
        return res.status(500).json({ error: "Error fetching user details" });
    }
};

//UPDATE USER DETAILS 
async function handleUpdateUserDetails(req, res) {
    // Take the current name and email from the request body
    const { fullname, email } = req.body;

    // Check if the fullname and email are present
    if (!fullname || !email) {
        return res.status(400).json({ Error: "Name and email are required" });
    }

    try {
        // Get a database connection
        const dbConnection = await sqlConnection();

        // SQL query to update the user details
        const updateSqlQuery = 'UPDATE USER_SIGNUP SET fullname = ?, email = ? WHERE id = ?' ;
        const values = [fullname, email, req.user._id]; // Assuming req.user.id contains the user's ID

        // Execute the query
        dbConnection.query(updateSqlQuery, values, (err, result) => {
            if (err) {
                console.error("Error executing query:", err);
                return res.status(500).json({ Error: "Failed to update user details" });
            }
            // Check if any rows were affected (optional)
            if (result.rowCount === 0) {
                return res.status(404).json({ Error: "User not found or no changes made" });
            }
            // Respond with success message
            return res.status(200).json({ Status: "User details updated successfully" });
        });

    } catch (err) {
        console.error("Database connection error:", err);
        return res.status(500).json({ Error: "Internal Server Error" });
    }
}
//FORGOT PASSWORD :
//NODEMAILER TRANSPORTER 
const transporter = nodemailer.createTransport({
    service: 'Gmail', // or any other email service you use
    auth: {
        user: 'fakeemailaditya@gmail.com',
        pass: google_app_password
    }
});
async function handleForgotPassword(req,res){

    const {email} = req.body ; 


    try{
        const dbConnection = await sqlConnection() ; 
        const value=[email] ; 
        const forgotPasswordQuery = 'SELECT email from USER_SIGNUP WHERE email=?' ; 
        dbConnection.query(forgotPasswordQuery,value,(err,data)=>{
            if(err){
                return res.json({Error:"Unable to fetch email !"}) ; 
            }
            if(data.length > 0 ){
                
                const  resetToken = jwt.sign({email:email},email_jwt_key,{expiresIn:"1d"})
                const resetLink = `http://localhost:3000/ResetPassword/${resetToken}` ; 
                const mailOptions = {
                    from: 'AudioPress',
                    to: email,
                    subject: 'Password Reset Request',
                    text: `Please click on the following link to reset your password: ${resetLink}`,
                    html: `<p>Please click on the following link to reset your password: <a href="${resetLink}">Reset Password</a></p>`
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return res.json({ Error: "Unable to send email!" });
                    } else {
                        return res.json({ Status: "Password reset email sent successfully!" });
                    }
                });
            }else {
                return res.json({Error:"User Not Found"}) ;
            }
        })

    }catch(err){
        return res.json({Error:"Error Occurred !"}) ; 
    }

    //get the email from frontend 
    //write the query select the email from database which resembles the email we retreived from frontend 
    //if user does not exist -- give error 
    //else if user is there -- get the id from jwt token and send it to the nodemailer 
    //nodemailer will send the email of the reset link to the registered email .... 

}
//RESET PASSWORD
async function handleResetPassword(req, res) {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const decoded = jwt.verify(token, email_jwt_key);
        const email = decoded.email;

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const dbConnection = await sqlConnection();
        const value = [hashedPassword, email];
        const updatePasssql = 'UPDATE USER_SIGNUP SET password = ? WHERE email = ?';

        dbConnection.query(updatePasssql, value, (err, data) => {
            if (err) {
                return res.json({ Error: "Unable to update password" });
            }
            return res.json({ Status: "Password Changed Successfully!" });
        });

    } catch (err) {
        return res.json({ Error: "Invalid or expired token" });
    }
}
// UPLOAD PROFILE PICTURE
async function  handleProfilePictureUpdate(req,res) {
    const {email} = req.user
    try {
      // Check if file is uploaded
      if (!req.file) {
        return res.status(400).json({ error: "Image file is required" });
      }
  
      // Construct image URL based on where uploads are stored
      const imgUrl = `${req.protocol}://${req.get('host')}/upload/images/${req.file.filename}`;
  
      // Check if user email is available in req.user
      const userEmail = email ; 
      console.log(userEmail)
      if (!userEmail) {
        return res.status(400).json({ error: "User email is required" });
      }
  
      // Database connection
      const dbConnection = await sqlConnection();
  
      // Update img_url in the database using email
      const updateQuery = 'UPDATE USER_SIGNUP SET img_url = ? WHERE email = ?';
       await dbConnection.query(updateQuery, [imgUrl, userEmail]);
  
      // Check if any rows were updated
     
  
      return res.status(201).json({ message: "Profile Picture Updated successfully", imgUrl });
    } catch (err) {
      console.error("Error uploading profile picture:", err);
      return res.status(500).json({ error: "Failed to update profile picture" });
    } 
  };
  //DELETE PROFILE PICTURE
  async function handleDeleteProfilePicture(req, res) {
    const { email } = req.user; // Ensure req.user contains the decoded token with email
  
    try {
      const dbConnection = await sqlConnection(); // Ensure this function is correctly implemented and returns a valid connection
  
      const deleteProfilePicQuery = 'UPDATE USER_SIGNUP SET img_url = NULL WHERE email = ?';
      
      dbConnection.query(deleteProfilePicQuery, [email], (err, data) => {
        if (err) {
          console.error("Error executing query:", err);
          return res.status(400).json({ error: "Unable to delete profile picture!" });
        }
        return res.status(200).json({ message: "Profile picture deleted successfully!" });
      });
  
      // Ensure proper cleanup of dbConnection if needed, e.g., dbConnection.release() or dbConnection.end()
      
    } catch (err) {
      console.error("Internal server error:", err);
      return res.status(500).json({ error: "Internal Server Error!" });
    }
  }
  
  
 
  







module.exports = {
    handleServer,
    handleSignup,
    handleLogin,
    handleLogout,
    handleFetchUserDetails,
    handleUpdateUserDetails,
    handleForgotPassword,
    handleResetPassword,
    handleProfilePictureUpdate,
    handleDeleteProfilePicture,

};
