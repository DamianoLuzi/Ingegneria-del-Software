import axios from "axios";
import { useState, useEffect} from "react";

function CartPage (props: any) {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  console.log("cart items", props.cartItems)
  const handlePlaceOrder = async () => {
   try {
    const orderData = {
      'user' : props.user,
      'items' : props.cartItems,
      'price': props.cartItems.reduce((total: number, item: any) => total + item.fields.price, 0)
    }
    const response = await axios.post(`http://localhost:8000/${props.user.username}/orders`, orderData)
    if(response) {
      setMessage('Order successfully placed!')
    }
   } catch (error:any) {
      console.log("POST error", error)
      if (error.response && (error.response.status === 500 || error.response.status === 400 )) {
        setError(error.response.data);
      } else {
        setError('An unexpected error occurred');
      }
   }
  }

  useEffect(() => {
    props.setCartItems(props.cartItems);
  }, [props.cartItems]);
  
  //selected items have been set as useState, might need to be stored in the DB
  return(
    <>
    {message && <h1>{message}</h1>}
    {error && <h1>Error: {error}</h1>}
    <h1>Your cart:</h1>
    <ul>
    {props.cartItems && props.cartItems.map((item:any) => (
      <li>
        <h3>{item.fields.name} - {item.fields.price} €</h3> 
      </li>
    ))}
    </ul>
    <h2>Total: {props.cartItems.reduce((total: number, item: any) => total + item.fields.price, 0)} €</h2>
    {props.cartItems.length != 0 && <button onClick={handlePlaceOrder}>Pay</button>}
    {<button onClick={() => props.setCartItems([])}>Cancel</button>}
    </>
  )
}

export default CartPage;