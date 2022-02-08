import React, {useContext} from 'react';
import {useHistory} from 'react-router-dom';
import {AuthContext} from '../../Context/AuthContext';
import './Documents.scss'

const Documents = (props) => {
   const {user} = useContext(AuthContext);
   const {push} = useHistory();

   return (
      <div className='docsContainer'>
         <div className="docHeader">
            <div className="docheaderText">
               Support Documents
            </div>
         </div>
         <div className='support-header-box'>
            {user.APP_ACCESS !== 'portal' ? (
               <button 
                  className='docButton'
                  onClick={() => {
                     push('/portal/Documents/Unsubscribe')
                  }}
               >
               <  div className='dashboardBox'>
                     <div className='doc-text'>
                        Unsubscribe Support Documents
                     </div>
                  </div>
               </button>

            ):null}
            {user.APP_ACCESS !== 'portal' ? (
               <button 
                  className='docButton'
                  onClick={() => {
                     push('/portal/Documents/Fileshare')
                  }}
               >
                  <div className='dashboardBox'>
                     <div className='doc-text'>
                        FileShare Support Documents
                     </div>
                  </div>
               </button>
            ):null}
         </div>
         
      </div>
   )

}

export default Documents;