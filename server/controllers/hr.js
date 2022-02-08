

module.exports = {

   addHRFile: async (req, res) => {
      const {
         FILE_NAME, 
         FILE_PATH,
         FILE_HEADER,
         FILE_TITLE,
         FILE_SIZE,
      } = req.body;

      const FILE_DATE = new Date ();

      const addHRFileQuery='INSERT INTO AVA_HR_FILES (FILE_HEADER, FILE_TITLE, FILE_NAME, FILE_PATH, FILE_SIZE, FILE_DATE) VALUES (?,?,?,?,?,?)'
      const values = [FILE_HEADER, FILE_TITLE, FILE_NAME, FILE_PATH,  FILE_SIZE, FILE_DATE]

      await pool.query(addHRFileQuery, values).then(([result]) => {
         res.send(result);
      }).catch((err) =>{
         console.log(err)
      })

   },

   getAllHRFiles: (req, res) => {
      pool.query('SELECT * FROM AVA_HR_FILES ORDER BY FILE_HEADER').then(([rows]) => {
         res.send(rows)
      }).catch((err)=>{
         console.log(err)
      })
   },

}