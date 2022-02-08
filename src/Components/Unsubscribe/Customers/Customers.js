import React, {useState, useContext, useEffect} from 'react';
import{useHistory, Link} from "react-router-dom";
import {CustmrsContext} from '../../../Context/CustmrsContext';
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
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import './Customers.scss'


const Customers = (props) => {
   const {customers, getCustomers, deleteCustomer} = useContext(CustmrsContext)
   const {push} = useHistory()
   const [rows, setRows] = useState(customers);
   const [search, setSearch] = useState("");

   const refreshPage = ()=>{
      window.location.reload();
   }

   const columnHeaders = [
      {id: 'customer', label: 'FIABBR'},
      {id: 'bank_name', label: 'Bank Name' },
      {id: 'logo', sortable: false, label: 'Logo' },
      {id: 'alt_logo', label: 'Alt Logo' },
      {id: 'language', label: 'Language' },
      {id: 'background_color', label: 'Background Color' },
      {id: 'row_color', label: 'Row Color' },
      {id: 'logo_align', label: 'Logo Align' },
      {id: 'survey_vendor', label: 'Survey Vendor' },
      {id: 'date', label: 'Date Created' },
      {id: 'status', label: 'Status' },
      {id: 'editCustomer', sortable: false, label: 'Edit Customer' },
      {id: 'preview', sortable: false, label: 'Preview' },
   ]

   const [sortByColumn, setSortByColumn] = useState(null)
   const [sortDirection, setSortDirection] =useState('asc')

   useEffect(() => {
      getCustomers()
   }, [])

   useEffect (async() => {
      await setRows(customers)
   }, [customers])

   useEffect(() => {
      const filteredRows = customers.filter((row) => {
         const results = (
            row.customer?.toLowerCase().includes(search.toLowerCase()) ||
            row.bank_name?.toLowerCase().includes(search.toLowerCase())
         )
         return results
      });
      setRows(filteredRows);
   }, [search]);


   const useStyles = makeStyles({
      root: {
         display: 'flex',
         justifyContent: 'flex-start',
         alignItems: 'flex-start',
         width: 1460,
         height: 680,
         marginLeft: 20,
      }
   });

   const classes = useStyles();
   
   return(
      <div className="customerContainer">
         <div className="custHeader">
            <div className="custheaderText">
               Customers
            </div>
            <button 
               onClick={() => {
                  push('/portal/Customers/Edit')
               }}
               className='customer-button'
            >
               
                  <GroupAddIcon  style={{ fontSize: 16 }} className='addCustIcon'/>
                  <div className='customer-text'>
                        Customer
                  
               </div>
            </button>
            <input
               type="text"
               placeholder="Search Customers"
               className='searchCustomer'
               onChange={(e) => setSearch(e.target.value)}
            />
         </div>
         <TableContainer
            classes={{
               root: classes.root, // class name, e.g. `classes-nesting-root-x`
               }}
            className='tableContainer' 
            component={Paper}
         >
            <Table 
               className='table' 
               aria-label="simple table"
               size={'small'}
               padding='checkbox'
            >
               <TableHead>
                  <TableRow>
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
                  })?.map((row, index) => (
                     <TableRow key={index}>
                        <TableCell component="th" scope="row">{row.customer}</TableCell>
                        <TableCell>{row.bank_name}</TableCell>
                        <TableCell><img className='customerLogo' src={row.logo} alt="avannis logo"/></TableCell>
                        <TableCell>{row.alt_logo}</TableCell>
                        <TableCell>{row.language}</TableCell>
                        <TableCell>
                           <div 
                              className='colorBox'
                              style={{backgroundColor: row.background_color}}
                           >
                           </div>
                           {row.background_color}
                        </TableCell>
                        <TableCell>
                           <div 
                              className='colorBox'
                              style={{backgroundColor: row.row_color}}
                           >
                           </div>
                           {row.row_color}
                           </TableCell>
                        <TableCell>{row.logo_align}</TableCell>
                        <TableCell>{row.survey_vendor}</TableCell>
                        <TableCell>{moment(row.date).format('MMM Do YYYY')}</TableCell>
                        <TableCell>{row.status}</TableCell>
                        <TableCell>
                           <Button
                              className="custmr-btn"
                              onClick={() =>{
                                 push(`/portal/Customers/Edit/${row.customer}`)
                              }}>
                              <CreateIcon className="custmrIcon"/>
                           </Button>
                           <Button
                              onClick={() => {
                                 window.confirm(`Are you sure you want to delete ${row.bank_name}?`) &&
                                 deleteCustomer(row.customer_id)
                              }}
                              // onClick={() => {
                              //    deleteCustomer(row.customer_id)
                              //    refreshPage()
                              // }}
                              className="custmr-btn">
                              <DeleteIcon className="custmrIcon"/>
                           </Button>
                        </TableCell>
                        <TableCell align="center">
                           <Button
                              onClick={() => {
                                 window.open(`/unsubscribe/${row.customer}?edr=sampleID&RID=respondent_id&email=some@email.com`, `_parent`)
                              }}
                           >
                              <DesktopWindowsIcon/>
                           </Button>
                        </TableCell>
                     </TableRow>
                  )) || null}
               </TableBody>
            </Table>
         </TableContainer>
      </div>
   )
}
export default Customers;