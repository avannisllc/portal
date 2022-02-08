import React, {useState, useContext, useEffect, useRef} from 'react';
import { HRContext } from '../../Context/HRContext';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import FolderIcon from '@material-ui/icons/Folder';
import './HRFileupload.scss';


const HRFileupload = (props) => {
   const {uploadHRFile} =useContext(HRContext);
   const [FILE_NAME, setFileName] = useState("");
   const [FILE_PATH, setSelectedFile] = useState("");
   const [FILE_HEADER, setHeader] = useState("");
   const [FILE_TITLE, setTitle] = useState("");
   const [FILE_SIZE, setFileSize] = useState("");

   // file upload code
   const fileRef = useRef()
   const file = fileRef?.current?.files?.[0]

   useEffect (()=>{
      if(file){ 
         setFileName(file.name)
         setFileSize(file.size)
         var reader = new FileReader()
         reader.onload = function(e){
            setSelectedFile(e.target.result)
         }
         reader.readAsDataURL(file)
      }
   },[file]);

   return (
      <div>
         <div className='HRUploadContainer'>
            <form className='HRupload-form'
               onSubmit={async (event)=>{
                  event.preventDefault()
                  await uploadHRFile({FILE_NAME, FILE_PATH, FILE_SIZE, FILE_HEADER, FILE_TITLE})
                  // refreshPage()
               }}
            >
               <label className='HRupload-text'>
                  HR File Upload
               </label>
               <label className="HRupload-Label">
                  <span className='HRuploadTitle'>Header</span>
                  <input
                     placeholder='File Header'
                     className='HRupload-input-field'
                     name="fileNotation"
                     id="fileNotation"
                     value={FILE_HEADER}
                     onChange={(e) => setHeader(e.target.value)}
                  />
               </label>
               <label className="HRupload-Label1">
                  <span className='HRuploadTitle'>Title</span>
                  <input
                     placeholder='File Title'
                     className='HRupload-input-field'
                     name="fileNotation"
                     id="fileNotation"
                     value={FILE_TITLE}
                     onChange={(e) => setTitle(e.target.value)}
                  />
               </label>
               <label className="HRupload-Label2">
                  <span className='HRuploadTitle'>File</span>
                  <div className='HRUploadBox'>
                     <div className='HRselectedFile'>
                        {FILE_PATH ? FILE_PATH : 
                        <div className='fileText'>Please choose file</div>}
                     </div>
                     <input
                        type='file'
                        name='myfile'
                        id="file"
                        className="inputfile"
                        ref={fileRef}
                        onChange={(e) => setSelectedFile(e.target.value)}
                     />
                     <label 
                        for="file"
                        className='HRUpload-labelSelectedFile'
                     >
                        <FolderIcon className='hrfolderIcon'/>
                     </label>
                  </div>
               </label>
               <button  
                  type='submit'
                  className='HRUpload-Button'
               >
                  <AddCircleIcon className='addHRCircleIcon'/>
               </button>

            </form>
         </div>
      </div>
   )

}

export default HRFileupload;