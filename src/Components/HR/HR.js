import React, {useState, useContext, useEffect} from 'react';
import { HRContext } from '../../Context/HRContext';
import HRFileupload from './HRFileupload';
import moment from 'moment'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from "@material-ui/core/Button";
import TableSortLabel from '@material-ui/core/TableSortLabel';
import GetAppIcon from '@material-ui/icons/GetApp';
import './HR.scss'


function bytesToSize(bytes) {
   const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
   if (bytes === 0) return 'n/a'
   const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
   if (i === 0) return `${bytes} ${sizes[i]})`
   return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`
}

const HR = (props) => {

   const {getAllHRFiles, HRFiles} =useContext(HRContext);
   const [rows, setRows] = useState(HRFiles);
   const [sortByColumn, setSortByColumn] = useState(null)
   const [sortDirection, setSortDirection] =useState('asc')

   useEffect(async()=>{
      await getAllHRFiles()
   },[])

   const columnHeaders = [
      {id: 'FILE_NUMBER', label: 'File #' },
      {id: 'FILE_HEADER', label: 'File Header' },
      {id: 'FILE_TITLE', label: 'File Title'},
      {id: 'FILE_NAME', label: 'File Name' },
      {id: 'FILE_SIZE', label: 'Size' },
      {id: 'FILE_DATE', label: 'Date' },
      {id: 'FILE_PATH', sortable: false, label: 'Download'},
   ]

   

   useEffect (() => {
      setRows(HRFiles)
   }, [HRFiles])


   // stylying code for material UI table
   const useStyles = makeStyles({
      root: {
         display: 'flex',
         justifyContent: 'flex-start',
         alignItems: 'flex-start',
         width: 1300,
         height: 590,
         marginRight: 20,
         marginBottom: 20
      },
      column: {
         width: 20
      }
   });

   const classes = useStyles();
   

   return(
      <div className='hrContainer'>
         <HRFileupload/>
         <TableContainer
            classes={{
               root: classes.root, // class name, e.g. `classes-nesting-root-x`
               }}
            className='hrtableContainer' 
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
                     {columnHeaders.map((rowHeader)=>(
                        <TableCell
                           key={rowHeader.id}
                           className='tableColumn'
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
               {rows?.sort((rowA, rowB)=>{
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
                     const size = bytesToSize(row.FILE_SIZE)
                     return( 
                        <TableRow >
                           <TableCell component="th" scope="row">{row.FILE_NUMBER}</TableCell>
                           <TableCell>{row.FILE_HEADER}</TableCell>
                           <TableCell>{row.FILE_TITLE}</TableCell>
                           <TableCell>{row.FILE_NAME}</TableCell>
                           <TableCell>{size}</TableCell>
                           <TableCell>{moment(row.FILE_DATE).format('l')}</TableCell>
                           <TableCell>
                              <Button
                                 href={row.FILE_PATH}
                                 target="_blank"
                                 download
                              >
                                 <GetAppIcon/>
                              </Button>
                           </TableCell>      
                        </TableRow>
                  )}) || null}
               </TableBody>
            </Table>
         </TableContainer>
      </div>
   )



}
export default HR;