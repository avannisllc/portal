const axios = require('axios');



module.exports = {
   unsubscribe: async (req, res) => {
      const qualtrics_id = "UR_02OnRERDKksju7y"
      const {SampleID, RespondentID, Study, email} = req.body;
      const UnsubDate = new Date()
      const sql = 'SELECT UnsubDate FROM unsubscribed WHERE email = ?'
      const value = [email]

      const [result] = await poolU.query(sql, value)
      if(result.length>0){
         console.log(result, 'email check')
         //need to send back unsubdate
         return res.status(200).send(result)
      }
      if(RespondentID){
         axios `http://us.qualtrics.com/cp/register.php?optout=true&RID=${RespondentID}&LID=${qualtrics_id}&BT=YXZhbm5pcw&_=1;`
      }

      const addUnsubscribeQuery = 'INSERT INTO unsubscribed (SampleID, RespondentID, UnsubDate, Study, email) VALUES (?,?,?,?,?)'
      const values = [SampleID, RespondentID, UnsubDate, Study, email]

      await poolU.query(addUnsubscribeQuery, values).then(([result]) => {
         res.send(result);
      }).catch((err) =>{
         console.log(err)
      })

   },
   
   getUnSubCustomer: (req ,res) => {
      const customer = req.params.customer
      poolU.query("SELECT * FROM customer WHERE customer = ?", [customer]).then(([result]) => {
         res.send(result[0]);
      }).catch((err) =>{
         console.log(err)
      })

   },


   findEmail: (req, res) => {
      const {email} = req.params
      poolU.query("SELECT * FROM unsubscribed WHERE email = ?", [email]).then(([result]) => {
         res.send(result);
      }).catch((err) =>{
         console.log(err)
      })
      
   }
}