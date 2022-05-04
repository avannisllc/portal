const nodemailer = require("nodemailer")
const jwt = require('jsonwebtoken');
const crypto = require('crypto')
require('dotenv').config();
const utils = require('../../src/sharedUtils/validationUtils');

let {
   SESSION_SECRET,
   RESETEMAIL,
   PASSWORD
} = process.env;

module.exports = {

   forgotPassword: async (req ,res) => {
   
      const {EMAIL} = req.params;
   
      const sql = 'SELECT USER_NUMBER, COMPANY_NAME, CONTACT_FNAME, CONTACT_LNAME, EMAIL FROM AVA_USERS WHERE EMAIL = ?';
      const sql2='INSERT INTO AVA_RESETPW (EMAIL, RESET_TOKEN) VALUES (?,?)';
      const value = [EMAIL];
   
      const transporter = nodemailer.createTransport({
         host: 'smtp.sendgrid.net',
         port: 465,
         secure: true,
         auth: {
            user: 'apikey',
            pass: PASSWORD
         }
      })
      
      pool.query(sql, value).then(([result]) => {
         if(result.length>0){
            crypto.randomBytes(32,(err,buffer)=>{
               if(err){
                  console.log(err)
               }
               const RESET_TOKEN = buffer.toString("hex")
               const values = [EMAIL, RESET_TOKEN]
               pool.query(sql2, values).then((user) => {
                  transporter.sendMail({
                     to:result[0].EMAIL,
                     from: RESETEMAIL,
                     subject:"password reset",
                     html:`
                     <p>Hi ${result[0].CONTACT_FNAME},</p>
                     <p>We heard that you forgot your password. Sorry about that!</p>
                     <p>But don’t worry! You can click on this <a href="https://portal.avannis.com/password/reset/${result[0].EMAIL}/${RESET_TOKEN}">link</a> to reset your password:</p>
                     <h4>Hope you have an amazing day.</h4>
                     `
                  })
                  res.send({message:"check your email"})
               })
               .catch((err)=> console.log(err));
            })
         }
      })
   }
}


function generateJWT(user) {

   return jwt.sign({
      user
   }, SESSION_SECRET, { expiresIn: '2h' }); 
}
