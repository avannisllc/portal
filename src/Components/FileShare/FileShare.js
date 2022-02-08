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

   const columnHeaders = [
      {id: 'FILE_NUMBER', label: 'File #' },
      {id: 'OWNER_NUMBER', label: 'Owner #' },
      {id: 'COMPANY_NAME', label: 'Owner' },
      {id: 'FILE_PATH', sortable: false, label: 'Download'},
      {id: 'FILE_NAME', label: 'File Name' },
      {id: 'delete', sortable: false, label: 'Delete'},
      {id: 'CREATE_DATE', label: 'DATE' },
      {id: 'FILE_SIZE', label: 'Size' },
      {id: 'FILE_NOTATION', sortable: false, label: 'Notes' },
   ]

   // const refreshPage = ()=>{
   //    window.location.reload();
   // }

   // checkbox-multiple deletes
   const [selected, setSelected] = useState([]);
   const isSelected = (FILE_NUMBER) => selected.indexOf(FILE_NUMBER) !== -1;

   const handleClick = (event, name) => {
      const selectedIndex = selected.indexOf(name);
      let newSelected = [];

      if (selectedIndex === -1) {
         newSelected = newSelected.concat(selected, name);
      } else if (selectedIndex === 0) {
         newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
         newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
         newSelected = newSelected.concat(
            selected.slice(0, selectedIndex),
            selected.slice(selectedIndex + 1),
         );
      }
      setSelected(newSelected);
   };

   // sorting state
   const [sortByColumn, setSortByColumn] = useState(null)
   const [sortDirection, setSortDirection] =useState('asc')

   // search state/code
   const [rows, setRows] = useState(fileShareFiles);
   const [search, setSearch] = useState("");
   // const [dropdown, setDropdown] = useState(fileShareFiles.COMPANY_NAME);

   const results = [...fileShareFiles.reduce((map, obj) => map.set(obj.COMPANY_NAME, obj),
      new Map()).values()];
   

   useEffect (() => {
      setRows(fileShareFiles)
   }, [fileShareFiles])

   useEffect(() => {
      const filteredRows = fileShareFiles.filter((row) => {
         const results = (
            row.COMPANY_NAME?.toLowerCase().includes(search.toLowerCase()) ||
            row.CONTACT_FNAME?.toLowerCase().includes(search.toLowerCase()) ||
            row.CONTACT_LNAME?.toLowerCase().includes(search.toLowerCase()) ||
            row.FILE_NAME?.toLowerCase().includes(search.toLowerCase()) ||
            row.USERNAME?.toLowerCase().includes(search.toLowerCase())

         )
         return results
      });
      setRows(filteredRows);
   }, [search]);

   // get files based off permission

   useEffect(async() =>{
      if(user.APP_ACCESS === 'portal'){
         await getFiles(user.COMPANY_NAME)
         // await getFiles(user.USER_NUMBER)
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

      reader.onerror = (event) => {
         const error = event.target.error
         console.error(`Error occured while reading ${file.name}`, error)
         alert(`Error occured while loading ${file.name}. Please upload again`, error);
      }
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
   //          console.log(e.target.result)
   //       }
   //       reader.readAsDataURL(file);
   //       // reader.onload = () => resolve(reader.result);
   //       // reader.onerror = error => reject(error);
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

   const handleDownload = (event, FILE_NUMBER, FILE_NAME) => {
      setDownloadLoading(true)
      axios
      .get(`/api/downloadFile/${FILE_NUMBER}`)
      .then((res) => {
         setDownloadLoading(false)
         console.log(res.data, "response")
         const anchor = document.createElement('a');
         anchor.style.display = 'none';
         anchor.href = res.data;
         anchor.download = FILE_NAME;
         anchor.click();
      }) 
      .catch(() => console.log("there was an error"))
   }


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
                        {FILE_NAME ? FILE_NAME : 
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

         {/* this is the code for search */}

         <div className='search-box'>
            {user.APP_ACCESS !== 'portal' ? 
               <label className="fileshare-Label3">
                  <select 
                     className='fileshareSelect2'
                     defaultValue={search}
                     value={search}
                     required
                     onChange={(e) => {
                        setSearch(e.target.value)
                     }}
                  >
                     <option value="DEFAULT">Choose a company ...</option>
                     {results?.map(owner => 
                        <option
                           key={owner.USER_NUMBER}
                           value = {owner.COMPANY_NAME}
                        >
                           {owner.COMPANY_NAME}
                        </option>
                     )}
                  </select>
                  <button
                     className='clearSearchBtn'
                     onClick={() => {
                        setSearch('')
                     }}
                  >
                     X
                  </button>
               </label>
            :null}

            <input
               type="text"
               placeholder="Search Files"
               className='searchFileshareFiles'
               onChange={(e) => setSearch(e.target.value)}
            />
         </div>

         {/* This is the code for the table of files */}
         {selected.length >0 ?
            <div className='allSlctDeleteBox'>
               <button
                  className='allSelectDelBtn'
                  onClick={() =>{
                     deleteFiles(user.USER_NUMBER, selected)
                     // refreshPage()
                  }}
               >
                  <DeleteIcon 
                     className='deleteIcon'
                     fontSize="small"
                  />
                  Delete Selected Files
               </button>
            </div>
         :null}
         <div className='fileshareTable'>
            <TableContainer
               classes={{
                  root: classes.root, // class name, e.g. `classes-nesting-root-x`
                  }}
               className='filesharetableContainer' 
               component={Paper}
            >
               
               <Table 
                  className='table' 
                  aria-label="simple table"
                  size={'small'}
                  padding='none'
               >
                  <TableHead>
                     <TableRow>
                        <TableCell />
                        {columnHeaders.map((rowHeader)=>(
                           <TableCell
                              key={rowHeader.id}
                           >
                              {rowHeader.sortable === false ? (
                                 rowHeader.label
                              ):(
                                 <TableSortLabel
                                    active={rowHeader.id === sortByColumn}
                                    direction={sortDirection}
                                    onClick={()=>{
                                       setSortByColumn(rowHeader.id)
                                       if(sortDirection === 'asc'){
                                          setSortDirection('desc')
                                       } else {
                                          setSortDirection('asc')
                                       }
                                    }}
                                 >
                                    {rowHeader.label}
                                 </TableSortLabel>
                              )}
                           
                           </TableCell>
                        ))}
                        
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {rows?.sort((rowA, rowB) => {
                        if(sortDirection === 'desc'){
                           if (rowB[sortByColumn] < rowA[sortByColumn]) {
                              return -1;
                           }
                           if (rowB[sortByColumn] > rowA[sortByColumn]) {
                              return 1;
                           }
                        } else {
                           if (rowB[sortByColumn] > rowA[sortByColumn]) {
                              return -1;
                           }
                           if (rowB[sortByColumn] < rowA[sortByColumn]) {
                              return 1;
                           }
                        }
                           return 0;
                     })?.map((row, index) => {
                        const isItemSelected = isSelected(row.FILE_NUMBER);
                        const labelId = index;
                        const size = bytesToSize(row.FILE_SIZE)

                        return (
                           <TableRow 
                              hover
                              onClick={(event) => {
                                 handleClick(event, row.FILE_NUMBER)
                                 // setRowCount(row?.length)
                              }}
                              role="checkbox"
                              aria-checked={isItemSelected}
                              tabIndex={-1}
                              key={row.FILE_NUMBER}
                              selected={isItemSelected}
                           >
                              <TableCell padding="checkbox">
                                 <Checkbox
                                    checked={isItemSelected}
                                 />
                              </TableCell>
                              <TableCell 
                                 component="th" 
                                 id={labelId} 
                                 scope="row"
                                 padding="none"
                              >
                                 {row.FILE_NUMBER}
                              </TableCell>
                              <TableCell>{row.OWNER_NUMBER}</TableCell>
                              <TableCell>{row.COMPANY_NAME || row.OWNER}</TableCell>
                              <TableCell>
                              {!downloadLoading ?
                                 <Button
                                 onClick={(event) => {
                                    handleDownload(event, row.FILE_NUMBER, row.FILE_NAME)
                                 }}
                                 >
                                    <GetAppIcon/>
                                 </Button>
                              :
                                 <CircularProgress className='loadCircle' size={18}/>
                              }        
                              </TableCell>
                              <TableCell>{row.FILE_NAME}</TableCell>
                              <TableCell>
                              {!deleteLoading ?
                                 <Button
                                 onClick={async() => {
                                    window.confirm(`Are you sure you want to delete this ${row.FILE_NAME} file from ${row.COMPANY_NAME}?`) &&
                                    await deleteFile(row.FILE_NUMBER)
                                 }}
                                 // onClick={async() => {
                                 //    await deleteFile(row.OWNER_NUMBER, row)
                                 //    refreshPage()
                                 // }}
                                 className="delete-btn">
                                 <DeleteIcon className="custmrIcon"/>
                              </Button>
                              :
                                 <CircularProgress className='loadCircle' size={18}/>
                              } 
                                 
                              </TableCell>
                              <TableCell>{moment(row.CREATE_DATE).format('l')}</TableCell>
                              <TableCell>{size}</TableCell>
                              <TableCell>{row.FILE_NOTATION}</TableCell>
                           </TableRow>
                     )}) || null}
                  </TableBody>
               </Table>
            </TableContainer>
         </div>
      </div>
   )
}

export default FileShare;