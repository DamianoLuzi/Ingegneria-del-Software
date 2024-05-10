import axios from "axios";
import { useEffect, useState } from "react";
import '../styles/App.css'
function OrdersPage(props: any) {
  const [orders, setOrders] = useState([])
  const [showDetails, setShowDetails] = useState(false)
  const [orderDetails, setOrderDetails] = useState({   
    'created_at': '',
    'customer': '',
    'destination': '',
    'items':'',
    'price': '',
    'restaurant':  '',
    'rider': '',
    'status': '',
    'updated_at': ''
  })
  const [expandedOrder, setExpandedOrder] = useState<any>(null);
  const [filterText, setFilterText] = useState('')
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value); // Update filter text state when input changes
  };
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

  const fetchOrderDetails = async (order: any) => {
    console.log("order to fetch\n" , order.pk, typeof order.pk)
    const response = await axios.get(`http://localhost:8000/orders/${order.pk.toString()}`)
    console.log("order details\n", response)
    setShowDetails(true)
    setExpandedOrder(response.data);
  }

  const handleStatusChange = async (order:any) => {
    console.log("status change", props.user)
    const response = await axios.put(`http://localhost:8000/${props.user.ruolo}/${props.user.username}/orders`, order )
    console.log("PUT response", response.data)
  }
  return(
    <>
    <h1>Your orders:</h1>
      <div>
      <input
        type="text"
        placeholder="Filter by products in your order"
        value={filterText}
        onChange={handleFilterChange}
      />
      <ul className="card-list">
        {orders && 
        orders
        .filter((order: any) =>
          order.items.toLowerCase().includes(filterText.toLowerCase())
        )
        .map((order: any, index: number) => (
          <li>
            <div key={index} className = 'card'>
            <h2 onClick={() => {
              fetchOrderDetails(order)
              setShowDetails(true)
            }}>{order.items}</h2>
            {console.log("expanded order\n\n", expandedOrder)}
            {expandedOrder && expandedOrder.pk == order.pk &&
              (<div>
                <h2>Order Details:</h2>
                <p>Order ID: {expandedOrder.pk}</p>
                <p>Price: {expandedOrder.price} €</p>
                <p>Status: {expandedOrder.status}</p>
                <p>Restaurant: {expandedOrder.restaurant}</p>
                <p>Customer: {expandedOrder.customer}</p>
                <p>Assigned Rider: {expandedOrder.rider}</p>
                <p>Placed at: {expandedOrder.created_at}</p>
                <p>Updated at: {expandedOrder.updated_at}</p>
                <p>Expected delivery time: {expandedOrder.delivery_time} minutes</p>
                {/* Buttons for status changes depending on the type of user */}
                {props.user.ruolo === 'ristorante' && <button onClick={() => handleStatusChange(order)}>Order Ready!</button>}
                {props.user.ruolo === 'rider' && <button onClick={() => handleStatusChange(order)}>Order Delivered!</button>}
                {props.user.ruolo === 'cliente' && <button onClick={() => handleStatusChange(order)}>Order Received!</button>}
              </div>)}
          </div>   
          </li>
        ))}
        </ul>
      </div>
    </>
  )

}

export default OrdersPage;