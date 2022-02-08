import React, {useState, useContext, useEffect} from 'react';
import './Unsubscribe.scss';
import {UnsubContext} from '../../../Context/UnsubContext';
import queryString from 'query-string';
// import moment from 'moment';


const Unsubscribe = (props) => {
   // const [logo_url, setLogoUrl] = useState()
   // const [header_html_tag, setHeaderHtmlTag] = useState()

   const {
      unsubscribe, 
      getUnsubCustomer, 
      unsubscribedFailed, 
      unsubscribedLoading, 
      unsubSuccessful
   } = useContext(UnsubContext)

   const [customer, setCustomer] = useState('')
   const [bank_name, setBankName] = useState('')
   const [logo, setLogo] = useState('')
   const [alt_logo, setAltLogo] = useState('')
   const [language, setLanguage] = useState('')
   const [background_color, setBackgroundColor] = useState('')
   const [row_color, setRowColor] = useState('')
   const [logo_align, setLogoAlign] = useState('')
   const [survey_vendor, setSurveyVendor] = useState('')
   
   const [SampleID, setSampleID] = useState('')
   const [RespondentID, setRespondentId] = useState('')
   const [email, setEmail] = useState('')
   const [Study, setStudy] = useState('')
   
   let header_title = `${bank_name}: Unsubscribe Confirmation`

   let success_text = `You have been successfully unsubscribed from future ${alt_logo} survey invitations. Please allow 7 business days for this change to distribute throughout our system. Thank you.`
   // let already_text = `You were unsubscribed from ${alt_logo} survey invitation on ${moment(unsubscribeDate).format('MMMM Do YYYY')}`
   let error_text = `There was an error. Please try again later. If the problem still persists, please contact margaret.lange@avannis.com`

/// useEffect to pull customer info from DB and to pull params from URL
useEffect (async() =>{
   if(props.match.params.customer){
      const client = await getUnsubCustomer(props.match.params.customer)
      setCustomer(client.customer)
      setStudy(client.customer)
      setBankName(client.bank_name)
      setLogo(client.logo)
      setAltLogo(client.alt_logo)
      setLanguage(client.language)
      setBackgroundColor(client.background_color)
      setRowColor(client.row_color)
      setSurveyVendor(client.survey_vendor)
      setLogoAlign(client.logo_align)
   } 
   const values = queryString.parse(props.location.search)
   setEmail(values.email)
   setLanguage(values.lang)
   setSampleID(values.edr)
   setRespondentId(values.RID)
   

}, [])

   return(
      <body className="unsubscribe"  style={{backgroundColor: background_color}}>
         <div className="container">
            <div className='unsubLogoBox' style={{justifyContent: logo_align}}>
               <img 
                  className="unsublogo"  
                  src={logo}
                  alt="avannis logo"
               />
            </div>
            <div className="row" style={{backgroundColor: row_color}}></div>
            <div className="confirmText">
               Please confirm your intent to unsubscribe:
            </div>
            <div className="email">
               {email}
            </div>
               {unsubSuccessful ? '' :
                  <button 
                     className="unsubButton"
                     disabled={window.parent !== window}
                     onClick={() => {
                        unsubscribe({SampleID, RespondentID, Study, email})
                     }}
                  > 
                     {unsubscribedLoading && <span>Submitting</span>}
                     {!unsubscribedLoading && <span>Submit</span>}
                  </button>
               }
               <div className="success" style={{color: row_color}}>
                  {unsubSuccessful && <span>{success_text}</span>}
               </div>
               <div className="failed">
                  {unsubscribedFailed && <span>{error_text}</span>}
               </div>
         </div>
      </body>	
   )
}

export default Unsubscribe; 
