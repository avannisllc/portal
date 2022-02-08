

module.exports = {

   getCompanies:  (req, res) =>{
      pool.query('SELECT USER_NUMBER, COMPANY_NAME From AVA_USERS ORDER BY COMPANY_NAME').then(([rows]) =>{
         const results = [...rows.reduce((map, obj) => map.set(obj.COMPANY_NAME, obj),
            new Map()).values()];
         res.send(results)
      }).catch((err)=>{
         console.log(err)
      })
   },

   addFile: async (req, res) => {
      const {
         FILE_NAME, 
         FILE_PATH,
         FILE_NOTATION,
         FILE_SIZE,
         OWNER_NUMBER,
      } = req.body;

      const FILE_DATE = new Date ();
      const CREATE_DATE = new Date ();
      const REAL_FILE_NAME = FILE_NAME;
      const USER_NUMBER = OWNER_NUMBER

      let result = FILE_PATH.includes("fakepath");

      if(FILE_PATH === "" || result){
         res.send('file needs to be reloaded');
      }else{
         const OWNER = await pool.query('SELECT * FROM AVA_USERS WHERE USER_NUMBER = ?', [USER_NUMBER]).then(([result]) => {
            console.log(result[0].COMPANY_NAME)
            return result[0].COMPANY_NAME
         }).catch((err) => {
            console.log(err)
         })
   
         const addFileQuery='INSERT INTO AVA_FTP_FILES (FILE_NAME, FILE_PATH, REAL_FILE_NAME, FILE_DATE, CREATE_DATE, OWNER_NUMBER, FILE_NOTATION, FILE_SIZE, OWNER) VALUES (?,?,?,?,?,?,?,?, ?)'
         const values = [FILE_NAME, FILE_PATH, REAL_FILE_NAME, FILE_DATE, CREATE_DATE, OWNER_NUMBER, FILE_NOTATION, FILE_SIZE, OWNER]
   
         await pool.query(addFileQuery, values).then(([result]) => {
            res.send('success');
         }).catch((err) =>{
            console.log(err)
         })
      }

   },

   getFiles: (req, res) => {

      const OWNER = req.params.COMPANY_NAME
      pool.query("SELECT FILE_NUMBER,  CREATE_DATE,  FILE_DATE, OWNER_NUMBER, OWNER, FILE_NAME, FILE_NOTATION, FILE_SIZE FROM AVA_FTP_FILES WHERE OWNER = ? ORDER BY OWNER", [OWNER]).then(([results]) => {
         res.send(results);
      }).catch((err) => {
         console.log(err)
      })
   },

   getAllFiles: (req, res) => {

      // AVA_FTP_FILES.FILE_PATH,
      pool.query('SELECT AVA_USERS.COMPANY_NAME, AVA_FTP_FILES.FILE_NUMBER,  AVA_FTP_FILES.CREATE_DATE,  AVA_FTP_FILES.FILE_DATE, AVA_FTP_FILES.OWNER_NUMBER, AVA_FTP_FILES.OWNER, AVA_FTP_FILES.FILE_NAME, AVA_FTP_FILES.FILE_NOTATION, AVA_FTP_FILES.FILE_SIZE FROM (AVA_USERS INNER JOIN AVA_FTP_FILES ON AVA_USERS.USER_NUMBER = AVA_FTP_FILES.OWNER_NUMBER) ORDER BY COMPANY_NAME').then(([rows]) => {
         res.send(rows)
      }).catch((err)=>{
         console.log(err)
      })
   },

   deleteFile: async (req, res) => {
      const FILE_NUMBER = req.params.FILE_NUMBER
      const deleteFileQuery = "DELETE FROM AVA_FTP_FILES WHERE FILE_NUMBER = ?"
      const value = [FILE_NUMBER]

      await pool.query(deleteFileQuery, value).then(([rows]) => {
         console.log('File Deleted')
         res.send(rows)
      }).catch((err)=>{
         console.log(err)
      })
   },

   deleteFiles: async (req, res) => {
      const DEL_OWNER_NUMBER = req.params.OWNER_NUMBER
      const array = (req.body)

      const query= `select * FROM AVA_FTP_FILES WHERE FILE_NUMBER IN (?)`;
      const queryData=[array];

      await pool.query(query, queryData).then((results) => {
         console.log(results, 'results')
         if(results.length > 0){
            const [data] = results;
            data.forEach(async(row) => {
               let REAL_FILE_NAME = row.FILE_NAME
               let DEL_FILE_NUMBER = row.FILE_NUMBER
               let FILE_NAME = row.FILE_NAME
               let FILE_PATH = row.FILE_PATH
               let FILE_DATE= row.FILE_DATE
               let CREATE_DATE = row.CREATE_DATE
               let OWNER_NUMBER = row.OWNER_NUMBER
               let FILE_SIZE = row.FILE_SIZE
               let deleteFileQuery = "DELETE FROM AVA_FTP_FILES WHERE FILE_NUMBER = ?"
               let value = [row.FILE_NUMBER]
               await pool.query(deleteFileQuery, value).then((user) => {
                  console.log(`File Deleted ${row.FILE_NUMBER}`)
               }).catch((err)=> {
                  console.log(err);
                  return res.send(err);
               })
               return console.log('deleted files');
            })
            return res.send('files deleted');
         } else{
            console.log('error')
         }
      })
      .catch((err)=> {
         console.log(err);
         return res.send(err);
      })
   },

   downloadFile: async (req, res) => {

      const FILE_NUMBER = req.params.FILE_NUMBER

      pool.query("SELECT FILE_PATH FROM AVA_FTP_FILES WHERE FILE_NUMBER = ?", [FILE_NUMBER]).then(([result]) => {
         res.send(result[0].FILE_PATH);
         // console.log(result[0], 'result')
      }).catch((err) => {
         console.log(err)
      })
   }

}