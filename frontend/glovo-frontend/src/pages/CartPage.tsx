import axios from "axios";
import { useState } from "react";

function CartPage (props: any) {
  const [message, setMessage] = useState('')
  console.log("cart items", props.cartItems)
  const handlePlaceOrder = async () => {
    const orderData = {
      'user' : props.user,
      'items' : props.cartItems,
      'price': props.cartItems.reduce((total: number, item: any) => total + item.fields.price, 0)
    }
    const response = await axios.post(`http://localhost:8000/${props.user.username}/orders`, orderData)
    if(response) {
      setMessage('Order successfully placed!')
    }
  }

  //selected items have been set as useState, might need to be stored in the DB
  return(
    <>
    {message && <h1>{message}</h1>}
    <h1>Your cart:</h1>
    <ul>
    {props.cartItems && props.cartItems.map((item:any) => (
      <li>
        <h3>{item.fields.name} - {item.fields.price} €</h3> 
      </li>
    ))}
    </ul>
    <h2>Total: {props.cartItems.reduce((total: number, item: any) => total + item.fields.price, 0)} €</h2>
    {props.cartItems.length != 0 && <button onClick={handlePlaceOrder}>Buy</button>}
    </>
  )
}

export default CartPage;