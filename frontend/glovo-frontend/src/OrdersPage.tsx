import axios from "axios";
import { useEffect, useState } from "react";

function OrdersPage(props: any) {
  const [orders, setOrders] = useState([])
  useEffect(() => {
    console.log("props user", props.user)
    const fetchOrders = async () => {
      const username = props.user.ruolo === 'ristorante' ? props.user.name : props.user.username
      console.log("username orders", username)
      const response = await axios.get(`http://localhost:8000/${username}/orders`)
      console.log("orders response", response)
      if(response) setOrders(response.data)
    }
    fetchOrders()
  }, [])
  return(
    <>
    <h1>Your orders:</h1>
      <div>
      <ul>
        {orders && 
        orders.map((order: any, index: number) => (
          <li>
            <div key={index}>
            <h2>{order.fields.items}</h2>
            <p>Price: {order.fields.price} €</p>
            <p>Status: {order.fields.status}</p>
          </div>
          </li>
        ))}
        </ul>
      </div>
    </>
  )

}

export default OrdersPage;