import axios from 'axios'
import React, {createContext, useState} from 'react'


export const UnsubContext = createContext(null)
export const UnsubProvider=(props) => {

   const [unsubCustomer, setUnsubCustomer] = useState([])
   const [unsubscribeDate, setUnsubscribeDate] = useState()
   const [unsubscribedFailed, setUnsubscribedFailed] = useState()
   const [unsubscribedLoading, setUnsubscribeLoading] = useState()
   const [unsubSuccessful, setUnsubSuccessful] =useState()
   const [unsubscribes, setUnsubscribes] = useState()
   const [noUser, setNoUser] = useState()

   const  unsubscribe = (body) =>{
      console.log(body,'unsub conext')
      setUnsubscribedFailed(false)
      setUnsubscribeLoading(true)
      return axios
         .post("/api/unsubscribe", body)
         .then((res) => {
            setUnsubscribeDate(res.data)
            setUnsubscribeLoading(false)
            setUnsubSuccessful(true)
            return res.data
         })
         .catch(() => {
            setUnsubscribedFailed(true)
            setUnsubscribeLoading(false)
            console.log("there was an error")
         })
   }

   const getUnsubCustomer = (customer) => {
      console.log(customer, "context")
      return axios
      .get(`/api/unsubscribe/${customer}`)
      .then((res) => {
         setUnsubCustomer(res.data)
         return res.data
      }) 
      .catch(() => console.log("there was an error"))
      // console.log(client, "customer context")
   }

   const getUnsubscribes = () =>{
      return axios
      .get("/api/unsubscribes")
      .then((res) => {
         setUnsubscribes(res.data)
         return res.data
      })
         .catch(() => console.log("there was an error"))
   }

   const getEmail = (email) => {
      return axios
      .get(`/api/unsubscribes/${email}`)
      .then((res) => {
         setUnsubscribes(res.data)
         if(res.data.length === 0){
            setNoUser('Email not found')
         }
         return res.data
      }) 
      .catch(() => console.log("there was an error"))
   }


   
   return(
      <UnsubContext.Provider value={{
         unsubscribe, 
         getUnsubCustomer,
         getUnsubscribes,
         getEmail, 
         unsubCustomer, 
         unsubscribeDate, 
         unsubscribedFailed, 
         unsubscribedLoading, 
         unsubSuccessful,
         unsubscribes,
         noUser,
         setNoUser
      }}>
         {props.children}
      </UnsubContext.Provider>
   )
}