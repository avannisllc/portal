import React, {useContext, useEffect, useState} from 'react';
import {useHistory} from "react-router-dom";
import {AuthContext} from '../../Context/AuthContext';
import moment from 'moment';
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
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import './User.scss';

const Users = (props) => {
   const {users, deleteUser, getUsers}  = useContext(AuthContext)
   const {push} = useHistory()
   const [rows, setRows] = useState(users);
   const [search, setSearch] = useState("");

   const [sortByColumn, setSortByColumn] = useState(null)
   const [sortDirection, setSortDirection] =useState('asc')


   const columnHeaders = [
      {id: 'COMPANY_NAME', label: 'Company' },
      {id: 'CONTACT_FNAME', label: 'First Name' },
      {id: 'CONTACT_LNAME', label: 'Last Name' },
      {id: 'USERNAME', label: 'User Name' },
      {id: 'EMAIL', label: 'Email' },
      {id: 'CREATE_DATE', label: 'Date Created' },
      {id: 'UPDATE_DATE', label: 'Date Updated' },
      {id: 'LAST_LOGIN', sortable: false, label: 'Last Login' },
      {id: 'APP_ACCESS',   label: 'App Access' },
      {id: 'DEACTIVATE',   label: 'Deactivate' },
      {id: 'editUser', sortable: false, label: 'Edit User' },
      
   ]

   useEffect(() => {
      getUsers()
   },[]);

   useEffect (() => {
      setRows(users)
   }, [users])

   useEffect(() => {
      const filteredRows = users.filter((row) => {
         const results = (
            row.COMPANY_NAME?.toLowerCase().includes(search.toLowerCase()) ||
            row.CONTACT_FNAME?.toLowerCase().includes(search.toLowerCase()) ||
            row.CONTACT_LNAME?.toLowerCase().includes(search.toLowerCase()) ||
            row.USERNAME?.toLowerCase().includes(search.toLowerCase())
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
         fontSize: 7,
         marginTop: 5,
         marginRight: 20,
      }
   });

   const classes = useStyles();

   return(
      <div className='usersContainer'>
         <div className="userHeader">
            <div className="userheaderText">
               Users
            </div>
            <button 
               onClick={() => {
                  push('/portal/register')
               }}
               className='user-button'
            >
               <PersonAddIcon style={{ fontSize: 16 }} className='addUserIcon'/>
               <div className='user-text'>
                     User
               </div>
            </button>
            <input
               type="text"
               placeholder="Search Users"
               className='searchUsers'
               onChange={(e) => setSearch(e.target.value)}
            />
         </div>
         <TableContainer 
            classes={{
               root: classes.root, // class name, e.g. `classes-nesting-root-x`
               }}
            className='userTableContainer' component={Paper}>
            <Table 
               className='userTable'
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
               })?.map((row, index) => (
                  <TableRow key={index} className="userTableRow">
                     <TableCell component="th" scope="row">{row.COMPANY_NAME}</TableCell>
                     <TableCell>{row.CONTACT_FNAME}</TableCell>
                     <TableCell>{row.CONTACT_LNAME}</TableCell>
                     <TableCell>{row.USERNAME}</TableCell>
                     <TableCell>{row.EMAIL}</TableCell>
                     <TableCell>{moment(row.CREATE_DATE).format('l')}</TableCell>
                     <TableCell>{moment(row.UPDATE_DATE).format('l')}</TableCell>
                     <TableCell>{moment(row.LAST_LOGIN).format('l LT')}</TableCell>
                     <TableCell>{row.APP_ACCESS}</TableCell>
                     <TableCell>{row.DEACTIVATE}</TableCell>
                     <TableCell>
                        <Button
                           className="custmr-btn"
                           onClick={() =>{
                              push(`/portal/Users/Edit/${row.USER_NUMBER}`)
                           }}
                        >
                           <CreateIcon className="custmrIcon"/>
                        </Button>
                        <Button
                           className="custmr-btn"
                           onClick={() => {
                              window.confirm(`Are you sure you want to remove ${row.USERNAME} as a user?`) &&
                              deleteUser(row.USER_NUMBER)
                           }}
                        >
                           <DeleteIcon className="custmrIcon"/>
                        </Button>
                     </TableCell>
                  </TableRow>
               ))}
               </TableBody>
            </Table>
         </TableContainer>

      </div>
   )
}

export default Users;