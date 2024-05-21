import axios from "axios";
import { useEffect, useState } from "react";
import '../styles/App.css'
function OrdersPage(props: any) {
  const [orders, setOrders] = useState([])
  const [showDetails, setShowDetails] = useState(false)
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [filterText, setFilterText] = useState('')
  const [successMessage, setSuccessMessage] = useState(false); 
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value); // Update filter text state when input changes
  };
  useEffect(() => {
    const fetchOrders = async () => {
      const response = await axios.get(`http://localhost:8000/${props.user.ruolo}/${props.user.username}/orders`)
      console.log("orders response", response)
      if(response) setOrders(response.data)
    }
    fetchOrders()
  }, [])

  const fetchOrderDetails = async (order: any) => {
    const response = await axios.get(`http://localhost:8000/orders/${order.pk.toString()}`)
    console.log("order details\n", response)
    setShowDetails(true)
    setOrderDetails(response.data);
  }

  const handleStatusChange = async (order:any) => {
    const response = await axios.put(`http://localhost:8000/${props.user.ruolo}/${props.user.username}/orders`, order )
    if (response.status === 200) {
      setSuccessMessage(true);
      setTimeout(() => {
        setSuccessMessage(false);
      }, 5000); // Hide the message after 5 seconds
    }
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
      {successMessage && <div className="success-message"><h1>Successfully updated order status!</h1></div>}
      <ul className="card-list">
        {orders && 
        orders
        .filter((order: any) =>
          order.prodotti.some((item: any) =>
            item.name.toLowerCase().includes(filterText.toLowerCase())
          )
        )
        .map((order: any, index: number) => (
          <li>
            <div key={index} className = 'card'>
            <h2 onClick={() => {
              fetchOrderDetails(order)
              setShowDetails(true)
            }}>{order.prodotti.map((i :any )=> " - " + i.name)}</h2>
            {orderDetails && orderDetails.pk == order.pk &&
              (<div>
                <h2>Order Details:</h2>
                <p>Order ID: {orderDetails.pk}</p>
                <p>Price: {orderDetails.price} €</p>
                <p>Status: {orderDetails.status}</p>
                <p>Restaurant: {orderDetails.restaurant}</p>
                <p>Customer: {orderDetails.customer}</p>
                <p>Assigned Rider: {orderDetails.rider}</p>
                <p>Placed at: {orderDetails.created_at}</p>
                <p>Updated at: {orderDetails.updated_at}</p>
                <p>Expected delivery time: {orderDetails.delivery_time} minutes</p>
                {/* Buttons for status changes depending on the type of user */}
                {props.user.ruolo === 'ristorante' && <button className="button" onClick={() => handleStatusChange(order)}>Order Ready!</button>}
                {props.user.ruolo === 'rider' && <button className="button" onClick={() => handleStatusChange(order)}>Order Delivered!</button>}
                {props.user.ruolo === 'cliente' && <button className="button" onClick={() => handleStatusChange(order)}>Order Received!</button>}
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