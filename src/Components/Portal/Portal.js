import React, {useContext} from 'react';
import {AuthContext} from '../../Context/AuthContext';
import { Switch, Route, Redirect} from "react-router-dom";
import EditUser from '../User/EditUser';
import Users from '../User/User';
import Register from '../Auth/Register';
import Home from '../Home/Home';

//Fileshare
import FileShare from '../FileShare/FileShare';

//Unsubescribe
import Customers from '../Unsubscribe/Customers/Customers';
import EditCustomer from '../Unsubscribe/Customers/EditCustomer';
import UnsubscribeView from '../Unsubscribe/Unsubscribe/UnsubscribeView'

//Support Documents
import Documents from '../Documents/Documents'
import UnsubscribeDoc from '../Documents/UnsubscribeDoc';
import FileshareDoc from '../Documents/FileshareDoc';

// HR Components
import HR from '../HR/HR';


import './Portal.scss'



const Portal = (props) => {
   const {user} = useContext(AuthContext)

   return(
      <div className="mainContainer">
         <Switch>
            {user.APP_ACCESS !== 'portal' ? (
               <Route exact path ="/portal/home" component={Home}/>
            ): null} 

            {/* User Routes */}
            {user.APP_ACCESS === 'admin' || 'root' ? (
               <Route path="/portal/Register" component={Register} render={props => <Register {...props} />}/>
               ): null}
            {user.APP_ACCESS === 'admin' || 'root' ? (
               <Route exact path="/portal/Users" component={Users}/>
            ): null}
            <Route exact path="/portal/Users/Edit/:USER_NUMBER" component={EditUser}/>

            {/* FileShare Share */}
            <Route exact path="/portal/fileshare" component={FileShare}/>

            {/* Support Document Routes */}
            {user.APP_ACCESS !== 'portal' ? (
               <Route exact path="/portal/Documents" component={Documents}/>
            ): null}
            {user.APP_ACCESS !== 'portal' ? (
               <Route exact path="/portal/Documents/Unsubscribe" component={UnsubscribeDoc}/>
            ): null}
            {user.APP_ACCESS !== 'portal' ? (
               <Route exact path="/portal/Documents/Fileshare" component={FileshareDoc}/>
            ): null}

            {/* Unsubscribe Routes */}
            {user.APP_ACCESS !== 'portal' ? (
               <Route exact path="/portal/Customers" component={Customers}/>
            ): null}
            {user.APP_ACCESS !== 'portal' ? (
               <Route exact path="/portal/Customers/Edit" component={EditCustomer}/>
            ): null}
            {user.APP_ACCESS !== 'portal' ? (
               <Route exact path="/portal/Customers/Edit/:customer" component={EditCustomer}/>
            ): null}
            {user.APP_ACCESS !== 'portal' ? (
               <Route exact path ="/portal/unsub" component={UnsubscribeView}/>
            ): null}

            {/* HR Routes */}
            {user.APP_ACCESS === 'admin' ? (
               <Route path="/portal/HR" component={HR}/>
               ): null}

            {user.APP_ACCESS === 'portal' ? (
               <Redirect to={{pathname: "/portal/fileshare"}}/>
            ): null}

            {user.APP_ACCESS !== 'portal' ? (
            <Redirect to={{pathname: "/portal/home"}}/>
            ): null}
         </Switch>

      </div>
   )
}
export default Portal;