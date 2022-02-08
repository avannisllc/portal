import React, {useState, useContext, useEffect} from 'react';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import {UnsubContext} from '../../../Context/UnsubContext';
import moment from 'moment';
import './UnsubscribeView.scss';



const UnsubscribeView = () => {
   const {unsubscribes, getEmail, noUser, setNoUser} = useContext(UnsubContext)
   const [email, setEmail] = useState();

   return (
   <div className='unsubViewContainer'>
      <div className='unsubViewBox'>
         <div className='unsubViewForm'>
            <form 
               className='getEmail-form' 
               onSubmit={(event)=>{
                  event.preventDefault()
                  getEmail(email)
               }}
            >
               <label className='unsub-view-label'>
                  Please enter Email to verify if they have unsubscribed.
               </label>
               <div className='input-email-box'>
                  <input   
                     placeholder='Email'
                     className='unsubView-input-field'
                     name="email"
                     required
                     id="email"
                     label="email"
                     value={email}
                     onChange={(e) => {
                        setEmail(e.target.value)
                        setNoUser('')
                     }}
                  />
                  <button  
                     type='submit'
                     className='unsubViewEmail-btn'
                  >
                     Enter
                  </button>
               </div>
            </form>
         </div>
         {noUser ? 
            <div className="noUser"> {noUser}
            </div>
         : null}
         <div className='unsubViewTableContainer'>
            <Paper className='unsubViewPaper'>
               <TableContainer className='UnsubTableBox'>
                  <Table 
                     className='unsubViewTable' 
                     aria-label="simple table"
                     size={'small'}
                     padding='checkbox'
                  >
                     <TableHead>
                        <TableRow>
                           <TableCell>Sample Id</TableCell>
                           <TableCell>Respondent Id</TableCell>
                           <TableCell>Unsubscribe Date</TableCell>
                           <TableCell>Customer</TableCell>
                           <TableCell>Email</TableCell>
                        </TableRow>
                     </TableHead>
                     <TableBody>
                        {unsubscribes?.map((row) => (
                           <TableRow key={row.sample_id}>
                              <TableCell component="th" scope="row">
                                 {row.sample_id}
                              </TableCell>
                              <TableCell>{row.respondent_id}</TableCell>
                              <TableCell>{moment(row.unsubdate).format('MMM Do YYYY, h:mm a')}</TableCell>
                              <TableCell>{row.customer}</TableCell>
                              <TableCell>{row.email}</TableCell>
                           </TableRow>
                        )) || null}
                     </TableBody>
                  </Table>
               </TableContainer>
            </Paper>
         </div>
      </div>
   </div>

      
   );
}
export default UnsubscribeView;