import React, {useContext} from 'react';
import{useHistory} from "react-router-dom";
import {AuthContext} from '../../Context/AuthContext';

import GroupIcon from '@material-ui/icons/Group';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import PersonIcon from '@material-ui/icons/Person';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import ListAltIcon from '@material-ui/icons/ListAlt';
import HelpIcon from '@material-ui/icons/Help';
import SearchIcon from '@material-ui/icons/Search';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';


import './Home.scss'


const Home = (props) => {
   const {user, logout}  = useContext(AuthContext)

   const {push} = useHistory()

   return(
      <div className='homeContainer'>
         <div className='logoBox'>
            <img 
               className='homeLogo' 
               src="https://us.avannis.com/wp-content/uploads/2018/05/unnamed-1.png"
               alt="avannis logo"
            />
            <div className='home-headerText'>
               Hello {user.CONTACT_FNAME}
            </div>
         </div>
         <div className='text1'>
            User
         </div>
         <div className='dashboardContainer'>
            {user.APP_ACCESS === 'admin' ? (
               <button 
                  className='homebutton'
                  onClick={() => {
                     push('/portal/users')
                  }}
               >
                  <div className='dashboardBox'>
                     <AccountCircleIcon  style={{ fontSize: 70 }} className='homeIcon'/>
                     <div className='text'>
                        Users
                     </div>
                  </div>
               </button>
            ): null}
            {user.APP_ACCESS === 'admin' ? (
               <button
                  onClick={() => {
                     push('/portal/register')
                  }}
                  className='homebutton'
               >
                  <div className='dashboardBox'>
                     <PersonAddIcon  style={{ fontSize: 70 }} className='homeIcon'/>
                     <div className='text'>
                        User
                     </div>
                  </div>
               </button>
            ): null}
            {user.APP_ACCESS === 'avannis' ? (
               <button
               onClick={() => {
                  push(`/portal/Users/Edit/${user.USER_NUMBER}`)
               }}
               className='homebutton'
            >
               <div className='dashboardBox'>
                  <PersonIcon  style={{ fontSize: 70 }} className='homeIcon'/>
                  <div className='text'>
                     Edit
                  </div>
               </div>
            </button>
            ): null}
            <button
               onClick={() => {
                  logout()
               }}
               className='homebutton'
            >
               <div className='dashboardBox'>
                  <ExitToAppIcon style={{ fontSize: 70 }} className='homeIcon'/>
                  <div className='text'>
                     Logout
                  </div>
               </div>
            </button>
            
            {user.APP_ACCESS === 'avannis' ? (
               <div
               className='homeBox'
               >
               <div className='dashboardBox'>
                  <InsertEmoticonIcon  style={{ fontSize: 70 }} className='homeIcon'/>
                  <div className='text'>
                     Smile
                  </div>
               </div>
            </div>
         ): null}
         </div>
         
         {/* Unsunscribe dashboard */}
         <div className='text1'>
            Unsubscribe
         </div>
         <div className='dashboardContainer'>
            <button
               onClick={() => {
                  push('/portal/customers')
               }}
               className='homebutton'
            >
               <div className='dashboardBox'>
                  <GroupIcon  style={{ fontSize: 70 }} className='homeIcon'/>
                  <div className='text'>
                     Customers
                  </div>
               </div>
            </button>
            <button 
               onClick={() => {
                  push('/portal/Customers/Edit')
               }}
               className='homebutton'
            >
               <div className='dashboardBox'>
                  <GroupAddIcon  style={{ fontSize: 70 }} className='homeIcon'/>
                  <div className='text'>
                     Customer
                  </div>
               </div>
            </button>
            <button 
               className='homebutton'
               onClick={() => {
                  push('/portal/unsub')
               }}
            >
               <div className='dashboardBox'>
                  <SearchIcon  style={{ fontSize: 70 }} className='homeIcon'/>
                  <div className='text'>
                     Email
                  </div>
               </div>
            </button>
            
         </div>
         
         {/* Fileshare dashboard */}
         <div className='dashboardContainer'>
            <div className='dashboardBox2'>
               <div className='text3'>
               Fileshare
               </div>
               <button 
                  onClick={() => {
                     push('/portal/fileshare')
                  }}
                  className='homebutton'
               >
                  <div className='dashboardBox'>
                     <ListAltIcon  style={{ fontSize: 70 }} className='homeIcon'/>
                     <div className='text'>
                        Fileshare
                     </div>
                  </div>
               </button>
            </div>
            <div className='dashboardBox2'>
               <div className='text3'>
               Support
               </div>
               <button
                  onClick={() => {
                     push('/portal/Documents')
                  }}
                  className='homebutton'
               >
                  <div className='dashboardBox'>
                     <HelpIcon style={{ fontSize: 70 }} className='homeIcon'/>
                     <div className='text'>
                        Documents
                     </div>
                  </div>
               </button>
            </div>
            {user.APP_ACCESS === 'admin' ? (
               <div className='dashboardBox2'>
                  <div className='text3'>
                  HR
                  </div>
                  <button
                     onClick={() => {
                        push('/portal/hr')
                     }}
                     className='homebutton'
                  >
                     <div className='dashboardBox'>
                        <SupervisedUserCircleIcon style={{ fontSize: 70 }} className='homeIcon'/>
                        <div className='text'>
                           Documents
                        </div>
                     </div>
                  </button>
               </div>
            ): null}
         </div>
      </div>
   )

}

export default Home;