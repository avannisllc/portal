import axios from 'axios'
import React, {createContext, useState} from 'react'
import{useHistory} from "react-router-dom";


export const CustmrsContext = createContext(null)
export const CustmrsProvider=(props) => {
   const [customers, setCustomers] = useState([])
   const [client, setClient] = useState([])
   const {push} = useHistory()
   const refreshPage = ()=>{
      window.location.reload();
   }

   const getCustomers = () =>{
      axios
      .get("/api/customers")
      .then((res) => {
         setCustomers(res.data)
         push("/portal/customers")
      })
         .catch(() => console.log("there was an error"))
   }

   const getCustomer = (customer) => {
      // console.log(customer, "context")
      return axios
      .get(`/api/customer/${customer}`)
      .then((res) => {
         setClient(res.data)
         return res.data
      }) 
      .catch(() => console.log("there was an error"))
      // console.log(client, "customer context")
   }

   const addCustomer = (body) => {
      axios
      .post("/api/customer", body)
      .then((res) => {
         push('/portal/customers')
      })
      .catch(() => console.log("there was an error"))
      console.log('customer Context--', customers)
   }

   const deleteCustomer = (customer_id) => {
      axios
      .delete(`/api/customer/${customer_id}`)
      .then((res) => {
         setTimeout(refreshPage(), 2000)
      })
      .catch(() => console.log("there was an error"))
      }


   const editCustomer = (customer_id, body) => {
      axios
         .put(`/api/customer/${customer_id}`, body)
         .then((res) => {
            push('/portal/customers')
         })
         .catch(() => console.log("there was an error"))
   }


   return(
      <CustmrsContext.Provider value={{
         client, customers, 
         getCustomer, 
         getCustomers, 
         addCustomer, 
         deleteCustomer, 
         editCustomer
      }}>
         {props.children}
      </CustmrsContext.Provider>
   )
}