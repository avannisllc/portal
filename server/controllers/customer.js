

module.exports = {
   getCustomers: (req, res) => {
      poolU.query('SELECT * From customer ORDER BY bank_name').then(([rows]) => {
         res.send(rows)
      }).catch((err)=>{
         console.log(err)
      })
   },

   getCustomer: (req ,res) => {
      const customer = req.params.customer
      poolU.query("SELECT * FROM customer WHERE customer = ?", [customer]).then(([result]) => {
         res.send(result[0]);
      }).catch((err) => {
         console.log(err)
      })

   },

   addCustomer: (req, res) => {
      const {
         customer, 
         bank_name, 
         logo, 
         alt_logo, 
         language, 
         background_color, 
         row_color,
         logo_align,
         survey_vendor,
         status
      } = req.body

      const date = new Date()

      const addCustomerQuery = "INSERT INTO customer (customer, bank_name, logo, alt_logo, language, background_color, row_color, logo_align, survey_vendor, date, status) VALUES (?,?,?,?,?,?,?,?,?,?,?)"
      const values = [customer, bank_name, logo, alt_logo, language, background_color, row_color, logo_align, survey_vendor, date, status]

      poolU.query(addCustomerQuery, values).then(([result]) => {
         res.send(result);
      }).catch((err) =>{
         console.log(err)
      })
   },

   updateCustomer: async (req, res) => {
      const {customer_id} = req.params
      const {
         customer,
         bank_name,
         logo,
         alt_logo,
         language,
         background_color,
         row_color,
         logo_align,
         survey_vendor,
         status
      } = req.body
      const updateCustomerQuery = "UPDATE customer SET customer = ?, bank_name = ?, logo = ?, alt_logo = ?, language = ?, background_color = ?, row_color = ?, logo_align = ?, survey_vendor = ?, status = ? WHERE customer_id = ?"
      const values = [customer, bank_name, logo, alt_logo, language, background_color, row_color, logo_align, survey_vendor, status, customer_id]

      poolU.query(updateCustomerQuery, values).then(([result]) => {
         res.send(result);
      }).catch((err) =>{
         console.log(err)
      })
   },

   deleteCustomer: async (req, res) => {
      const {customer_id} = req.params
      const deleteCustomeryQuery = "DELETE FROM customer WHERE customer_id = ?"
      const value = [customer_id]

      poolU.query(deleteCustomeryQuery, value).then(([result]) => {
         res.send('deletion was successful')
      }).catch((err) =>{
         console.log(error)
      })

   }
}

