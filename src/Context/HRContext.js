import axios from 'axios'
import React, {createContext, useState} from 'react'

export const HRContext = createContext(null)
export const HRProvider=(props) => {

   const [HRFiles, setHRFiles] = useState([])

   const refreshPage = ()=>{
      window.location.reload();
   }



   const uploadHRFile = (body)=>{
      axios
      .post('/api/addHRFile', body)
      .then((res) => {
         setTimeout(refreshPage(), 2000)
         getAllHRFiles()
         // push('/portal')
      }
      )
      .catch(() => console.log("there was an error"))
   }

   const getAllHRFiles = () =>{
      axios
      .get("/api/getAllHRFiles")
      .then((res) => {
         setHRFiles(res.data)
      })
         .catch(() => console.log("there was an error"))
   }

   return(
      <HRContext.Provider value={{
         uploadHRFile,
         HRFiles,
         getAllHRFiles
      }}>
         {props.children}
      </HRContext.Provider>
   )

}