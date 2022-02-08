import React from 'react';
import './UnsubscribeDoc.scss'

const UnsubscribeDoc = (props) => {


   return (
      <div className='unsubscribe-docsContainer'>
         <div className="unsubscribe-docHeader">
            <div className="unsubscribe-docheaderText">
               Unsubscribe Support Documents
            </div>
         </div>
         <div className='unsubscribe-doc-support-video-container'>
            <label className='unsubscribe-doc-support-video-label'>
               <div className='unsubscribe-doc-support-video-text'>
                  How to Add a Customer
               </div>
               <iframe
                  className='unsubscribe-doc-support-video'
                  allow="fullscreen;"
                  frameBorder="0"
                  width="410" height="205" controls
                  src='https://screencast-o-matic.com/watch/cr1ZYtV1Uve'
               />


            </label>
         </div>

      </div>
   )

}

export default UnsubscribeDoc;