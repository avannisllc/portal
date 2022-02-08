import React, {useState, useContext, useEffect, useRef} from 'react';
import {FileShareContext} from '../../Context/FileShareContext';
import {AuthContext} from '../../Context/AuthContext';
import moment from 'moment'
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from "@material-ui/core/CircularProgress";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import Button from "@material-ui/core/Button";
import TableSortLabel from '@material-ui/core/TableSortLabel';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import FolderIcon from '@material-ui/icons/Folder';
import GetAppIcon from '@material-ui/icons/GetApp';
import './FileShare.scss'
import axios from 'axios'

function bytesToSize(bytes) {
   const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
   if (bytes === 0) return 'n/a'
   const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
   if (i === 0) return `${bytes} ${sizes[i]})`
   return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`
}


const FileShare = (props) => {
   const {user} = useContext(AuthContext);
   const [OWNER_NUMBER, setOwnerNumber] = useState(user.USER_NUMBER);
   const [FILE_NAME, setFileName] = useState("")
   const [FILE_PATH, setSelectedFile] = useState("");
   const [FILE_NOTATION, setFileNotation] = useState("");
   const [FILE_SIZE, setFileSize] = useState("");
   const [downloadLoading, setDownloadLoading] = useState(false)

   const {
      companies, 
      getCompanies, 
      uploadFile, 
      fileShareFiles,
      getFiles,
      getAllFiles,
      deleteFile,
      deleteFiles,
      loading,
      setLoading,
      deleteLoading, 
   }  = useContext(FileShareContext)

   // get files based off permission

   useEffect(async() =>{
      if(user.APP_ACCESS === 'portal'){
         await getFiles(user.USER_NUMBER)
      } else {
         await getAllFiles()
      } 
   
   },[]);

   // get company names for dropdown
   useEffect(async () => {
      await getCompanies()
   }, []);


   // file upload code

   const handleChange = (event) => {
      console.log(event.target.files[0]);
      setFileName(event.target.files[0].name);
      setFileSize(event.target.files[0].size);

      let file = event.target.files[0];
      var reader = new FileReader()
      reader.onload = function(event){
         setSelectedFile(event.target.result)
      }
      reader.readAsDataURL(file);
   }

   // const fileRef = useRef()
   // const file = fileRef?.current?.files?.[0]

   // useEffect (()=>{
   //    if(file){ 
   //       setFileName(file.name)
   //       setFileSize(file.size)
   //       var reader = new FileReader()
   //       reader.onload = function(e){
   //          setSelectedFile(e.target.result)
   //       }
   //       reader.readAsDataURL(file);
   //    }
   // },[file]);

   // stylying code for material UI table
   const useStyles = makeStyles({
      root: {
         display: 'flex',
         justifyContent: 'flex-start',
         alignItems: 'flex-start',
         width: 1460,
         height: 570,
         marginRight: 20,
      }
   });

   const classes = useStyles();


   return(
      <div className='fileshareContainer'>
         {/* this is the code for the file upload */}
         <div className='fileshareUploadBox'>
            <form className='fileupload-form'
               onSubmit={async (event)=>{
                  event.preventDefault()
                  setLoading(true)
                  await uploadFile({FILE_NAME, FILE_PATH, FILE_SIZE, FILE_NOTATION, OWNER_NUMBER})
               }}
            >
               <label className='fileShare-text'>
                  File Share
               </label>
               {user.APP_ACCESS !== 'portal' ? 
                  <label className="fileshare-Label">
                     <span className='fileNameTitle'>Company</span>
                     <select 
                        className='fileshareSelect'
                        defaultValue={OWNER_NUMBER}
                        value={OWNER_NUMBER}
                        required
                        onChange={(e) => {
                           setOwnerNumber(e.target.value)
                           
                        }}
                     >
                        <option value="DEFAULT">Choose a company ...</option>
                        {companies?.map(owner => 
                           <option
                              key={owner.USER_NUMBER}
                              value = {owner.USER_NUMBER}
                           >
                              {owner.COMPANY_NAME}
                           </option>
                        )}
                     </select>
                  </label>
               :null}
               <label className="fileshare-Label1">
                  <span className='fileNameTitle'>Notes</span>
                  <input
                     placeholder='File Notation'
                     className='fileNotation-input-field'
                     name="fileNotation"
                     id="fileNotation"
                     value={FILE_NOTATION}
                     onChange={(e) => setFileNotation(e.target.value)}
                  />
               </label>
               <label className="fileshare-Label2">
                  <span className='fileNameTitle'>File</span>
                  <div className='fileshareBox'>
                     <div className='selectedFile'>
                        {FILE_PATH ? FILE_PATH : 
                        <div className='fileText'>Please choose file</div>}
                     </div>
                     <input
                        type='file'
                        name='myfile'
                        id="file"
                        className="inputfile"
                        onChange={handleChange}
                        // ref={fileRef}
                        // onChange={(e) => setSelectedFile(e.target.value)}
                     />
                     <label 
                        for="file"
                        className='labelSelectedFile'
                     >
                        <FolderIcon className='folderIcon'/>
                     </label>
                  </div>
               </label>
               {!loading ?
                  <button  
                     type='submit'
                     className='fileShareButton'
                  >
                        <AddCircleIcon className='addCircleIcon'/>
                  </button>
               :
                  <CircularProgress className='loadCircle' size={18}/>
               }

            </form>
         </div>
      </div>   
   )
}
