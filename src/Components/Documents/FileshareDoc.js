import React from 'react';
import './FileshareDoc.scss'

const FileshareDoc = (props) => {


   return (
      <div className='fileshare-docsContainer'>
         <div className="fileshare-docHeader">
            <div className="fileshare-docheaderText">
               Fileshare Support Documents
            </div>
         </div>
         <div className='fileshare-doc-support-video-container'>
            <label className='fileshare-doc-support-video-label'>
               <div className='fileshare-doc-support-video-text'>
                  How to Upload a File
               </div>
               <iframe
                  className='fileshare-doc-support-video'
                  allow="fullscreen;"
                  frameBorder="0"
                  width="410" height="205" controls
                  src='https://screencast-o-matic.com/watch/cr1ZY4V1Uw1'
               />

            </label>
         </div>
         <div className='fileshare-doc-support-video-container'>
            <label className='fileshare-doc-support-video-label'>
               <div className='fileshare-doc-support-video-text'>
                  How to Delete Multiple Files
               </div>
               <iframe
                  className='fileshare-doc-support-video'
                  allow="fullscreen;"
                  frameBorder="0"
                  width="410" height="205" controls
                  src='https://screencast-o-matic.com/watch/cr1ZYgV1UwG'
               />

            </label>
         </div>
      </div>
   )

}

export default FileshareDoc;