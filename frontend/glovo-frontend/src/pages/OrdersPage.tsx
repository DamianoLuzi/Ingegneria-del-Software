import axios from "axios";
import { useEffect, useState } from "react";
import '../styles/App.css'
function OrdersPage(props: any) {
  const [orders, setOrders] = useState([])
  useEffect(() => {
    console.log("props user", props.user)
    const fetchOrders = async () => {
      console.log("username orders", props.user.username)
      const response = await axios.get(`http://localhost:8000/${props.user.ruolo}/${props.user.username}/orders`)
      console.log("orders response", response)
      if(response) setOrders(response.data)
    }
    fetchOrders()
  }, [])

  const handleStatusChange = async (order:any) => {
    console.log("status change", props.user)
    const response = await axios.put(`http://localhost:8000/${props.user.ruolo}/${props.user.username}/orders`, order )
    console.log("PUT response", response.data)
  }
  return(
    <>
    <h1>Your orders:</h1>
      <div>
      <ul className="card-list">
        {orders && 
        orders.map((order: any, index: number) => (
          <li>
            <div key={index} className = 'card'>
            <h2>{order.fields.items}</h2>
            <p>Price: {order.fields.price} €</p>
            <p>Status: {order.fields.status}</p>
            {/* Buttons for status changes depending on the type of user */}
            {props.user.ruolo === 'ristorante' && <button onClick={() => handleStatusChange(order)}>Order Ready!</button>}
            {props.user.ruolo === 'rider' && <button onClick={() => handleStatusChange(order)}>Order Delivered!</button>}
            {props.user.ruolo === 'cliente' && <button onClick={() => handleStatusChange(order)}>Order Received!</button>}
          </div>   
          </li>
        ))}
        </ul>
      </div>
    </>
  )

}

export default OrdersPage;