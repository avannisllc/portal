import React, {useContext, useRef, useEffect, useState} from 'react';
import {AuthContext} from '../../Context/AuthContext';
import {Redirect} from "react-router-dom";
import { Formik, Form, Field} from 'formik'
import './EditUser.scss'
import {UpdateUserSchema} from '../../sharedUtils/validationUtils'


const EditUser = (props) => {
   const {user, editUser, getUser} = useContext(AuthContext)
   const formikRef = useRef();
   const [toNext, setToNext] = useState(false)

   useEffect (async() =>{
      if(props.match.params.USER_NUMBER){
         const user = await getUser(props.match.params.USER_NUMBER)
         formikRef.current.resetForm({values:user})
   
      } 
   }, []);

   return (
         <div className='edituserform'>
            <Formik 
               innerRef={formikRef}
               initialValues={{
                  COMPANY_NAME: "",
                  CONTACT_FNAME: "",
                  CONTACT_LNAME: "",
                  USERNAME: "",
                  PASSWD: "",
                  EMAIL: "",
                  APP_ACCESS: "",
                  DEACTIVATE: "",
               }} 
               validationSchema={UpdateUserSchema}
               onSubmit={values => {
                  editUser(props.match.params.USER_NUMBER, values)
                  setToNext(true)
               }}
            >
               {({ values, errors, touched,resetForm }) => (
                  
                  <Form className={user.APP_ACCESS === 'admin'? 'edituser-form' : 'edituser-formB'}>
                     {toNext ? <Redirect to="/portal/Users" /> : null}
                  <img 
                     className='edituser-logo' 
                     src="https://us.avannis.com/wp-content/uploads/2018/05/unnamed-1.png"
                     alt="avannis logo"
                  />
                  {user.APP_ACCESS === 'admin' ? (
                     <label className="editUserLabel">
                        <span className='editUserlabelTitle'>Company</span>
                        <Field
                           placeholder='Company Name'
                           className={'edituser-input-field'+ (errors.COMPANY_NAME && touched.COMPANY_NAME ? ' is-invalid' : '')}
                           name="COMPANY_NAME"
                           required
                           id="COMPANY_NAME"
                           label="COMPANY NAME"
                     />
                     </label>
                  ): null}
                  <label className="editUserLabel">
                     <span className='editUserlabelTitle'>First Name</span>
                     <Field
                        placeholder='First Name'
                        className={'edituser-input-field'+ (errors.CONTACT_FNAME && touched.CONTACT_FNAME ? ' is-invalid' : '')}
                        name="CONTACT_FNAME"
                        required
                        id="CONTACT_FNAME"
                        label="CONTACT_FNAME"
                     />
                  </label>
                  <label className="editUserLabel">
                     <span className='editUserlabelTitle'>Last Name</span>
                     <Field
                        placeholder='Last Name'
                        className={'edituser-input-field'+ (errors.CONTACT_LNAME && touched.CONTACT_LNAME ? ' is-invalid' : '')}
                        required
                        id="CONTACT_LNAME"
                        label="CONTACT_LNAME"
                        name="CONTACT_LNAME"
                     />
                  </label>
                  <label className="editUserLabel">
                     <span className='editUserlabelTitle'>Email Address</span>
                     <Field
                        placeholder='Email Address'
                        className={'edituser-input-field'+ (errors.EMAIL && touched.EMAIL ? ' is-invalid' : '')}
                        required
                        id="EMAIL"
                        label="EMAIL"
                        name="EMAIL"
                        autoComplete="EMAIL"
                     />
                  </label>
                  <label className="editUserLabel">
                     <span className='editUserlabelTitle'>Username</span>
                     <Field
                        placeholder='Username'
                        className={'edituser-input-field'+ (errors.USERNAME && touched.USERNAME ? ' is-invalid' : '')}
                        required
                        id="USERNAME"
                        label="USERNAME"
                        name="USERNAME"
                        autoComplete="USERNAME"
                     />
                  </label>
                  {user.APP_ACCESS === 'admin' ?
                     <label className="editUserLabel">
                        <span className='editUserlabelTitle'>App Access</span>
                        <Field
                           as='select'
                           className={'edituser-input-field'}
                           required
                           name="APP_ACCESS"
                        >
                           <option value='portal'>Portal</option>
                           <option value='avannis'>Avannis</option>
                           <option value='admin'>Admin</option>
                        </Field>
                     </label>
                  :null}
                  {user.APP_ACCESS !== 'portal' ?
                     <label className="editUserLabel">
                        <span className='editUserlabelTitle'>Deactivate</span>
                        <Field
                           as='select'
                           className={'edituser-input-field'}
                           required
                           name="DEACTIVATE"
                        >
                           <option value='N'>No</option>
                           <option value='Y'>Yes</option>
                        </Field>
                     </label>
                  :null}
                  <label className="editUserLabel">
                     <span className='editUserlabelTitle'>Password</span>
                     <Field
                        placeholder='Please enter new password if you want to change it.'
                        className={'edituser-input-field'+ (errors.PASSWD && touched.PASSWD ? ' is-invalid' : '')}
                        name="PASSWD"
                        label="PASSWD"
                        type="password"
                        id="PASSWD"
                     />
                  </label>
                  <div className='editUserpwNote'>* Must Contain 12 Characters, 1 Uppercase, 1 Lowercase, 1 Number and 1 special case character.</div>
                  
                  <button  
                     type='submit'
                     className='register-btn'
                  >
                     Submit
                  </button>

                  </Form>
               )}
            </Formik>
         </div>
   );
}

export default EditUser;