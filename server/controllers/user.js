const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const utils = require('../../src/sharedUtils/validationUtils');
const SignupSchema = utils.SignupSchema;
const UpdateUserSchema = utils.UpdateUserSchema;

let {
   SESSION_SECRET
} = process.env;

module.exports = {

   register: async (req, res) => {
      const {
         COMPANY_NAME, 
         CONTACT_FNAME, 
         CONTACT_LNAME,
         USERNAME,
         PASSWD,
         ConfirmPASSWD,
         EMAIL
      } = req.body;

      const CREATE_DATE = new Date()
      const UPDATE_DATE = new Date ()
      const DEACTIVATE = 'N'
      const APP_ACCESS = "portal" 
      
      const isValid = await SignupSchema.isValid({
         COMPANY_NAME, 
         CONTACT_FNAME, 
         CONTACT_LNAME,
         USERNAME,
         PASSWD,
         ConfirmPASSWD,
         EMAIL
      })
      if(!isValid){
         return res.status(401).send('Is not valid')
      }

      const salt = bcrypt.genSaltSync(10)
      const hash = bcrypt.hashSync(PASSWD, salt)

      const sql='INSERT INTO AVA_USERS (COMPANY_NAME, CONTACT_FNAME, CONTACT_LNAME, USERNAME, PASSWD, EMAIL, CREATE_DATE, UPDATE_DATE, APP_ACCESS, DEACTIVATE) VALUES (?,?,?,?,?,?,?,?,?,?)'
      const values = [COMPANY_NAME, CONTACT_FNAME, CONTACT_LNAME, USERNAME, hash, EMAIL, CREATE_DATE, UPDATE_DATE, APP_ACCESS, DEACTIVATE]

      pool.query(sql, values).then((user) => {
         res.send('Register was successful')
         console.log('Register was successful')
         })
         .catch((err)=> {
            console.log(err);
            return res.send(err);
         })
   },

   login: async (req, res) => {
      const{USERNAME, PASSWD} = req.body;
      const LAST_LOGIN = new Date ()


      const sql = 'SELECT USERNAME, PASSWD FROM AVA_USERS WHERE USERNAME = ?'
      const getUserQuery = 'SELECT USER_NUMBER, COMPANY_NAME, CONTACT_FNAME, CONTACT_LNAME, USERNAME, EMAIL, CREATE_DATE, APP_ACCESS, DEACTIVATE FROM AVA_USERS WHERE USERNAME = ?'
      const updateLoginQuery = 'UPDATE AVA_USERS SET LAST_LOGIN = ? WHERE USERNAME = ?'
      const value = [USERNAME]
      const value2 = [LAST_LOGIN, USERNAME]

      try{
         const userPass = await pool.query(sql, value)
         if(userPass?.[0]?.[0]?.PASSWD && bcrypt.compareSync(PASSWD, userPass[0][0].PASSWD)){
            await pool.query(getUserQuery, value).then(([result]) => {
               console.log('login was successful');
               let user = result[0]
               return res.send({
                  user,
                  token: generateJWT(user)
               });
            })
   
            await pool.query(updateLoginQuery, value2).then((user) => {
               console.log('Last Login Updated')
            })
            
         }else{
            throw 'bad credentials'
         }
      }catch(error){
         console.log(error, 'jjjjj');
         return res.send(error);
      }
   },

   resetPassword: async(req, res) => {
      const{EMAIL, 
         RESET_TOKEN, 
         PASSWD,
         ConfirmPASSWD,
      } = req.body;

      const salt = bcrypt.genSaltSync(10)
      const hash = bcrypt.hashSync(PASSWD, salt)
      const LAST_LOGIN = new Date ()

      const sql = 'SELECT * FROM AVA_RESETPW WHERE EMAIL = ?'
      const updatePWQuery = 'UPDATE AVA_USERS SET PASSWD = ? WHERE EMAIL = ?'
      const getUserQuery = 'SELECT USER_NUMBER, COMPANY_NAME, CONTACT_FNAME, CONTACT_LNAME, USERNAME, EMAIL, CREATE_DATE, APP_ACCESS, DEACTIVATE FROM AVA_USERS WHERE EMAIL = ?'
      const deleteResetPWQuery = 'DELETE FROM AVA_RESETPW WHERE EMAIL = ?'
      const updateLoginQuery = 'UPDATE AVA_USERS SET LAST_LOGIN = ? WHERE EMAIL = ?'
      const value = [EMAIL]
      const value2 = [hash, EMAIL]
      const value3 = [LAST_LOGIN, EMAIL]
      
      try{
         const resetToken = await pool.query(sql, value)
         if(resetToken?.[0]?.[0]?.RESET_TOKEN && RESET_TOKEN === resetToken[0][0].RESET_TOKEN){
            await pool.query(getUserQuery, value).then(([results]) => {
               console.log('login was successful');
               let user = results[0]
               return res.send({
                  user,
                  token: generateJWT(user)
               });
            })
            
            await pool.query(updatePWQuery, value2).then((row) => {
               console.log('Password Updated')
            })
                  
            await pool.query(deleteResetPWQuery, value).then((user) => {
               console.log('Reset Token Deleted')
            })

            await pool.query(updateLoginQuery, value3).then((user) => {
               console.log('Last Login Updated')
            })
         }else{
            throw 'bad reset token'
         }
      }catch(err){
         console.log(err);
         return res.send(err);
      }
   },

   updateUser: async(req, res) => {
      const {USER_NUMBER} = req.params
      let {
         COMPANY_NAME, 
         CONTACT_FNAME, 
         CONTACT_LNAME,
         USERNAME,
         PASSWD,
         ConfirmPASSWD,
         EMAIL,
         APP_ACCESS,
         DEACTIVATE
      } = req.body
      
      const sql = 'SELECT PASSWD FROM AVA_USERS WHERE USERNAME = ?'
      const value = [USERNAME]

      let hash 
      if(PASSWD){
         const salt = bcrypt.genSaltSync(10)
         hash = bcrypt.hashSync(PASSWD, salt)
      } else{
         try{
            const [result] = await pool.query(sql, value)
            hash = result[0].PASSWD
            //we use a fake password for validation here
            PASSWD = '$$1Aa$$$$$$$$'
            ConfirmPASSWD = '$$1Aa$$$$$$$$'
         }catch(err){
            console.log(err)
         } 
      }
      
      const UPDATE_DATE = new Date()

      const sql2 = 'UPDATE AVA_USERS SET COMPANY_NAME = ?, CONTACT_FNAME = ?, CONTACT_LNAME = ?, USERNAME = ?, PASSWD = ?, EMAIL = ?, UPDATE_DATE = ?, APP_ACCESS = ?, DEACTIVATE = ? WHERE USER_NUMBER = ?'
      const values = [COMPANY_NAME, CONTACT_FNAME, CONTACT_LNAME, USERNAME, hash, EMAIL, UPDATE_DATE, APP_ACCESS, DEACTIVATE, USER_NUMBER]

      const isValid = await UpdateUserSchema.isValid({
         COMPANY_NAME, 
         CONTACT_FNAME, 
         CONTACT_LNAME,
         USERNAME,
         PASSWD,
         ConfirmPASSWD,
         EMAIL
      })
      if(!isValid){
         return res.status(401).send('Is not valid')
      }
      try{
         await pool.query(sql2, values)
         res.send('User info was updated')
      }catch(err){
         console.log(err)
      }
   },

   deleteUser: (req, res) => {
      const {USER_NUMBER} = req.params

      const sql = "DELETE FROM AVA_USERS WHERE USER_NUMBER = ?"
      const value = [USER_NUMBER]
      pool.query(sql, value).then((result) => {
         console.log('deletion was successful')
         res.send('deletion was successful');
      }).catch((err)=>{
         console.log(err)
      })   
   },

   getUsers: (req, res) =>{
      pool.query('SELECT USER_NUMBER, COMPANY_NAME, CONTACT_FNAME, CONTACT_LNAME, USERNAME, EMAIL, CREATE_DATE, UPDATE_DATE, LAST_LOGIN, APP_ACCESS, DEACTIVATE From AVA_USERS ORDER BY COMPANY_NAME').then(([rows]) =>{
         res.send(rows);
      }).catch((err)=>{
         console.log(err)
      })
   },

   getUser: (req ,res) => {
      const {USER_NUMBER} = req.params

      const sql = 'SELECT USER_NUMBER, COMPANY_NAME, CONTACT_FNAME, CONTACT_LNAME, USERNAME, EMAIL, APP_ACCESS, DEACTIVATE FROM AVA_USERS WHERE USER_NUMBER = ?'
      const value = [USER_NUMBER]

      pool.query(sql, value).then(([result]) => {
         res.send(result[0]);
      }).catch((err) => {
         console.log(err)
      })
   },

   logout: (req, res) => {
      // req.session.destroy()
      res.sendStatus(200)
   }
}


function generateJWT(user) {

   return jwt.sign({
      user
   }, SESSION_SECRET, { expiresIn: '2h' }); 
}