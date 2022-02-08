require('dotenv').config();
const express = require('express');
const auth = require("./middleware/auth");
const path = require('path');
const mysql = require('mysql2/promise');
const fs = require('fs');

//CONTROLLERS
const authCtrl = require('./controllers/user');
const emailCtrl = require('./controllers/mailer');
const ftpCtrl = require('./controllers/ftp');
const customerCtrl = require('./controllers/customer');
const unsubscribeCtrl = require('./controllers/unsubscribe');
const hrCtrl = require('./controllers/hr');


//MIDDLEWARE
const app = express();

app.use(express.static('build'));
app.use(express.json({limit:'110mb'}));

let {
   SERVER_PORT,
   CONNECTION_STRING,
   DBusername,
   DBpassword,
   DatabaseName,
   DatabaseUnsub,
   Port,
   DBhost,
   CERT_CA_PATH,
   CERT_KEY_PATH,
   CERT_PATH, 



} = process.env;

//DATABASE CONNECTION Fileshare

const pool = mysql.createPool({
   host: DBhost,
   user: DBusername,
   password: DBpassword,
   database: DatabaseName,
   port: Port,
   ssl: {
      ca: fs.readFileSync(CERT_CA_PATH ),
      key: fs.readFileSync(CERT_KEY_PATH),
      cert: fs.readFileSync(CERT_PATH)
   },
   waitForConnections: true,
   connectionLimit: 10,
   queueLimit: 0
});
global.pool = pool

//DATABASE CONNECTION Unsubscribe
const unsubscribePool = mysql.createPool({
   host: DBhost,
   user: DBusername,
   password: DBpassword,
   database: DatabaseUnsub,
   port: Port,
   ssl: {
      ca: fs.readFileSync(CERT_CA_PATH ),
      key: fs.readFileSync(CERT_KEY_PATH),
      cert: fs.readFileSync(CERT_PATH)
   },
   waitForConnections: true,
   connectionLimit: 10,
   queueLimit: 0
});
global.poolU = unsubscribePool


//Auth Endpoints
app.post('/auth/register', auth, authCtrl.register);
app.post('/auth/login', authCtrl.login);
app.post('/auth/logout', authCtrl.logout);
app.get('/api/user/:USER_NUMBER', authCtrl.getUser);
app.delete('/api/auth/:USER_NUMBER', auth, authCtrl.deleteUser);
app.get('/api/users', auth, authCtrl.getUsers);
app.put('/api/user/:USER_NUMBER', auth, authCtrl.updateUser);
app.post('/api/resetPassword', authCtrl.resetPassword);

//Email Endpoints
app.post('/api/forgotPassword/:EMAIL', emailCtrl.forgotPassword);

//File Share Endpoints
app.get('/api/companies', auth, ftpCtrl.getCompanies);
app.post('/api/addFile', auth, ftpCtrl.addFile);
app.post('/api/deleteFile/:FILE_NUMBER', auth, ftpCtrl.deleteFile);
app.post('/api/deleteFiles/:OWNER_NUMBER', auth, ftpCtrl.deleteFiles);
app.get('/api/getFiles/:COMPANY_NAME', auth, ftpCtrl.getFiles);
app.get('/api/getAllFiles', auth, ftpCtrl.getAllFiles);
app.get('/api/downloadFile/:FILE_NUMBER', auth, ftpCtrl.downloadFile);


//Customer Endpoints
app.get('/api/customers', auth, customerCtrl.getCustomers)
app.get('/api/customer/:customer', auth, customerCtrl.getCustomer)
app.post('/api/customer', auth, customerCtrl.addCustomer)
app.put('/api/customer/:customer_id', auth, customerCtrl.updateCustomer)
app.delete('/api/customer/:customer_id', auth, customerCtrl.deleteCustomer)

//Unsubscribe Endpoints
app.post('/api/unsubscribe', unsubscribeCtrl.unsubscribe)
app.get('/api/unsubscribe/:customer', unsubscribeCtrl.getUnSubCustomer)
app.get('/api/unsubscribes/:email', auth, unsubscribeCtrl.findEmail)
// app.get('/api/unsubscribes', auth, unsubscribeCtrl.getUnsubcribes)

//HR Endpoints
app.post('/api/addHRFile', auth, hrCtrl.addHRFile) 
app.get('/api/getAllHRFiles', hrCtrl.getAllHRFiles)



app.get('*', (req,res)=> { 
   res.sendFile(path.join(__dirname, '../build/index.html')) 
})

app.listen(SERVER_PORT, () => {
   console.log(`Listening on port: ${SERVER_PORT}`);
});