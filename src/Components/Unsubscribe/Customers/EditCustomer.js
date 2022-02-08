import React, {useState, useContext, useEffect, useRef} from 'react';
import {useHistory} from "react-router-dom";
import {CustmrsContext} from '../../../Context/CustmrsContext';
import './EditCustomer.scss'

const EditCustomer = (props) => {
   const [customer_id, setCustomerID] = useState("")
   const [customer, setCustomer] = useState("")
   const [bank_name, setBankName] = useState("")
   const [logo, setLogo] = useState("")
   const [alt_logo, setAltLogo] = useState("")
   const [language, setLanguage] = useState("")
   const [background_color, setBackgroundColor] = useState("")
   const [row_color, setRowColor] = useState("")
   const [logo_align, setLogoAlign] = useState("flex-start")
   const [survey_vendor, setSurveyVendor] = useState("alchemer")
   const [status, setStatus] = useState ("active")
   const logoRef = useRef()

   const file = logoRef?.current?.files?.[0]

   console.log(file, 'file')

   // var reader = new FileReader();

   useEffect (()=>{
      if(file){ 
         var reader = new FileReader()
         reader.onload = function(e){
            setLogo(e.target.result)
         }
         reader.readAsDataURL(file)
      }
   },[file])
   const {getCustomer, addCustomer, editCustomer} = useContext(CustmrsContext)
   
   const {push} = useHistory();

   useEffect (async() =>{
      if(props.match.params.customer){
         const client = await getCustomer(props.match.params.customer)
         setCustomerID(client.customer_id)
         setCustomer(client.customer)
         setBankName(client.bank_name)
         setLogo(client.logo)
         setAltLogo(client.alt_logo)
         setLanguage(client.language)
         setBackgroundColor(client.background_color)
         setRowColor(client.row_color)
         setLogoAlign(client.logo_align)
         setSurveyVendor(client.survey_vendor)
         setStatus(client.status)
      } 
   }, [])

   return (
         <div className='editCustomerContainer'>
            <form className='editcstmr-form' onSubmit={(event)=>{
               event.preventDefault()
               
               if(props.match.params.customer) {
                  editCustomer(customer_id,{
                     customer, bank_name, logo, alt_logo, language, background_color, row_color, logo_align, survey_vendor, status
                  }) 
               } else {
                  addCustomer({customer, bank_name, logo, alt_logo, language, background_color, row_color, logo_align, survey_vendor, status})
               }
               // push("/portal/customers")
            }}>
            <img 
               className='editcstmr-logo' 
               src="https://us.avannis.com/wp-content/uploads/2018/05/unnamed-1.png"
               alt="avannis logo"
            />
            <label className="editCustomerLabel">
               <span className='labelTitle'>FIABBR</span>
               <input   
                  placeholder='Customer'
                  className='editCustomer-input-field'
                  name="customer"
                  required
                  id="customer"
                  label="Customer"
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
               />
            </label>
            <label className="editCustomerLabel">
               <span className='labelTitle'>Bank Name</span>
               <input 
                  placeholder='Bank Name'
                  className='editCustomer-input-field'
                  required
                  id="bankName"
                  label="Bank Name"
                  name="bankName"
                  value={bank_name}
                  onChange={(e) => {
                     setAltLogo(e.target.value)
                     setBankName(e.target.value)}}
               />
            </label>
            <input 
               placeholder='Logo'
               className="logoinputfile"
               type='file'
               id="file"
               label="Picture"
               name="myfile"
               ref={logoRef}
               // value={logo}
               onChange={(e) => setLogo(e.target.value)}
            />
            <label 
               for="file"
               className='labelLogoFile'
            >
               Upload Logo
            </label>
            {logo ? <img src={logo} className='logoImg' alt='customer logo'/> : null}
            <label className="editCustomerLabel">
               <span className='labelTitle'>Language </span>
               <input      
                  placeholder='Language'
                  className='editCustomer-input-field'
                  required
                  name="language"
                  label="language"
                  id="language"
                  autoComplete="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
               />
            </label>
            <label className="editCustomerLabel">
               <span className='labelTitle'>Background Color </span>
               <input      
                  placeholder='Background Color'
                  className='editCustomer-input-field'
                  required
                  name="background color"
                  label="background color"
                  id="background color"
                  value={background_color}
                  onChange={(e) => setBackgroundColor(e.target.value)}
               />
            </label>
            <label className="editCustomerLabel">
               <span className='labelTitle'>Row Color </span>
               <input      
                  placeholder='Row Color'
                  className='editCustomer-input-field'
                  required
                  name="row color"
                  label="row color"
                  id="row color"
                  value={row_color}
                  onChange={(e) => setRowColor(e.target.value)}
               />
            </label>
            <label className="editCustomerLabel">
               <span className='labelTitle'> Logo Align </span>
               <select      
                  className='editCustomer-input-field'
                  value={logo_align}
                  required
                  onChange={(e) => {
                     setLogoAlign(e.target.value)
                  }}
               >
                  <option 
                     value='flex-end'
                     selected={'active' === status}
                  >
                     flex-end
                  </option>
                  <option 
                     value='flex-start'
                     selected={'active' === status}
                  >
                     flex-start
                  </option>
                  <option 
                  value='center'
                  selected={'active' === status}
               >
                  center
               </option>
               </select>  
            </label>
            <label className="editCustomerLabel">
            <span className='labelTitle'> Survey Vendor </span>
               <select      
                  placeholder='Survey Vendor'
                  className='editCustomer-input-field'
                  value={survey_vendor}
                  required
                  onChange={(e) => {
                     setSurveyVendor(e.target.value)
                  }}
               >
                  <option 
                     value='alchemer'
                     selected={'active' === status}
                  >
                     alchemer
                  </option>
                  <option 
                     value='qualtrics'
                     selected={'active' === status}
                  >
                     qualtrics
                  </option>
               </select>   
            </label>
            <label className="editCustomerLabel">
            <span className='labelTitle'> Status </span>
               <select      
                  placeholder='Status'
                  className='editCustomer-input-field'
                  value={status}
                  required
                  onChange={(e) => {
                     setStatus(e.target.value)
                  }}
               >
                  <option 
                     value='active' 
                     selected={'active' === status}
                  >
                     active
                  </option>
                  <option 
                     value='inactive'
                     selected={'active' === status}
                  >
                     inactive
                  </option>
               </select>  
            </label>
            <button  
               type='submit'
               className='editcstmr-btn'
            >
                  Enter
            </button>

            </form>
         </div>
   );
}

export default EditCustomer;