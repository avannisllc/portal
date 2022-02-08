import axios from 'axios'
import React, {createContext, useState} from 'react'



export const FileShareContext = createContext(null)
export const FileShareProvider=(props) => {

   const [companies, setCompanies] =useState([])
   const [fileShareFiles, setFileShareFiles] = useState([])
   const refreshPage = ()=>{
      window.location.reload();
   }
   const [loading, setLoading] = useState(false)
   const [deleteLoading, setDeleteLoading] = useState(false)


   const getCompanies = () =>{
      console.log('fileshare context')
      axios
      .get('/api/companies')
      .then((res) => {
         setCompanies(res.data)
      })
         .catch(() => console.log("there was an error"))
   }

   const uploadFile = (body)=>{
      axios
      .post('/api/addFile', body)
      .then((res) => {
         if(res.data === 'file needs to be reloaded'){
            alert('There was an error. Please try again')
         }
         if(res.data === 'success'){
            alert('File was uploaded successfully')
         }
         setLoading(false)
         setTimeout(refreshPage(), 2000)
         
         // push('/portal')
      })
      .catch(() =>{
         console.log("there was an error")
      })
   }

   const getFiles = (COMPANY_NAME) => {
      return axios
      .get(`/api/getFiles/${COMPANY_NAME}`)
      .then((res) => {
         setFileShareFiles(res.data)
         // return res.data
      }) 
      .catch(() => console.log("there was an error"))
   }

   const getAllFiles = () =>{
      axios
      .get("/api/getAllFiles")
      .then((res) => {
         setFileShareFiles(res.data)
      })
         .catch(() => console.log("there was an error"))
   }

   const deleteFile = (FILE_NUMBER)=>{
      setDeleteLoading(true)
      axios
      .post(`/api/deleteFile/${FILE_NUMBER}`)
      .then((res) => {
         setDeleteLoading(false)
         setTimeout(refreshPage(), 2000)
         // push('/portal')
      })
      .catch(() => console.log("there was an error"))
   }

   const deleteFiles = (USER_NUMBER, body)=>{
      console.log(body, 'context')
      const OWNER_NUMBER = USER_NUMBER
      setDeleteLoading(true)
      axios
      .post(`/api/deleteFiles/${OWNER_NUMBER}`, body)
      .then((res) => {
         setTimeout(refreshPage(), 1000)
         setDeleteLoading(false)
      }
      // push('/portal')
      )
      .catch(() => console.log("there was an error"))
   }


   return(
      <FileShareContext.Provider value={{
         companies,
         getCompanies,
         uploadFile,
         getFiles,
         fileShareFiles,
         getAllFiles,
         deleteFile,
         deleteFiles,
         loading,
         setLoading,
         deleteLoading, 
         setDeleteLoading
      }}>
         {props.children}
      </FileShareContext.Provider>
   )
}