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
      if(response) setOrders(response.data)
    }
    fetchOrders()
  }, [])

  const fetchOrderDetails = async (order: any) => {
    const response = await axios.get(`http://localhost:8000/orders/${order.pk.toString()}`)
    setShowDetails(true)
    setOrderDetails(response.data);
  }

  const handleStatusChange = async (order:any) => {
    const response = await axios.put(`http://localhost:8000/${props.user.ruolo}/${props.user.username}/orders`, order )
    if (response.status === 200) {
      setSuccessMessage(true);
      setTimeout(() => {
        setSuccessMessage(false);
      }, 5000);
    }
  }
  return(
    <>
    <h1>I Tuoi Ordini:</h1>
      <div>
      <input
      className="form-input"
        type="text"
        placeholder="Filtra Ordini"
        value={filterText}
        onChange={handleFilterChange}
      />
      {successMessage && <div className="success-message"><h1>Ordine Aggiornato Con Successo!</h1></div>}
      <ul className="list">
        {orders && 
        orders
        .filter((order: any) =>
          order.prodotti.some((item: any) =>
            item.name.toLowerCase().includes(filterText.toLowerCase())
          )
        )
        .map((order: any, index: number) => (
          <li>
            <div key={index} className = 'card' >
            <h2 onClick={() => {
              fetchOrderDetails(order)
              setShowDetails(true)
            }}>{order.prodotti.map((i :any )=> i.name  + " - ")}</h2>
            {orderDetails && orderDetails.pk == order.pk &&
              (<div>
                <h2>Dettagli del tuo Ordine:</h2>
                <p>ID Ordine: {orderDetails.pk}</p>
                <p>Prezzo: {orderDetails.price} €</p>
                <p>Status: {orderDetails.status}</p>
                <p>Ristorante: {orderDetails.restaurant}</p>
                <p>Cliente: {orderDetails.customer}</p>
                <p>Rider Assegnato: {orderDetails.rider}</p>
                <p>Creato: {orderDetails.created_at}</p>
                <p>Aggiornato: {orderDetails.updated_at}</p>
                <p>Tempo Stimato di Consegna: {orderDetails.delivery_time} minuti</p>
                {props.user.ruolo === 'ristorante' && <button className="button" onClick={() => handleStatusChange(order)}>Ordine Pronto alla Spedizione</button>}
                {props.user.ruolo === 'rider' && <button className="button" onClick={() => handleStatusChange(order)}>Ordine Consegnato</button>}
                {props.user.ruolo === 'cliente' && <button className="button" onClick={() => handleStatusChange(order)}>Ordine Ricevuto</button>}
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