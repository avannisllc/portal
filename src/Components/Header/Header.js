import React, {useContext} from 'react';
import {Link} from 'react-router-dom'
import {AuthContext} from '../../Context/AuthContext';
import{useHistory} from "react-router-dom";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HomeIcon from '@material-ui/icons/Home';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import './Header.scss'

const Header = () => {
   const {user, logout} = useContext(AuthContext);
   let history = useHistory();

   return (
      <div className="headerBox">
         { user ?
            <div className='header'>
               <img 
                  className='customer-logo' 
                  src="https://us.avannis.com/wp-content/uploads/2018/05/unnamed-1.png"
                  alt="avannis logo"
               />
               {/* <div 
                  className='headerText'> Hello {user.CONTACT_FNAME}
               </div> */}
               <div className="box">
                  {user.APP_ACCESS === 'portal' ?
                     <Link to={`/portal/Users/Edit/${user.USER_NUMBER}`} className='header-links'>
                        <AccountCircleIcon className='icon1'/> 
                        Edit
                        &nbsp;
                     </Link>
                  :null}
                  {user.APP_ACCESS === 'portal' ?
                  <Link to='/portal/fileshare' className='header-links'>
                     FileShare
                  </Link>
                  :null}
                  {user.APP_ACCESS !== 'portal' ? (
                     <Link to='/portal/home' className='header-links'>
                        <HomeIcon className='icon'/> Home
                     </Link>
                  ):null}
                  <button onClick={() => history.goBack()} className='header-back'>
                     <ArrowBackIcon className='icon'/>
                     Back
                  </button>
                  <button onClick={() => logout()} className='header-logout'>
                     <ExitToAppIcon className='icon'/>
                     Logout
                  </button>
               </div>
            </div>
         : null }
      </div>
   )
}

export default Header