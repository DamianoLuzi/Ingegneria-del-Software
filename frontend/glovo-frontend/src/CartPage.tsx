import axios from "axios";

function CartPage (props: any) {
  console.log("cart items", props.cartItems)
  const handlePlaceOrder = async () => {
    const orderData = {
      'user' : props.user,
      'items' : props.cartItems
    }
    const response = axios.post(`http://localhost:8000/${props.user.username}/orders`, orderData)
  }

  //selected items have been set as useState, might need to be stored in the DB
  return(
    <>
    <h1>Your cart:</h1>
    <ul>
    {props.cartItems && props.cartItems.map((item:any) => (
      <li>
        <h3>{item.fields.name} - {item.fields.price} €</h3> 
      </li>
    ))}
    </ul>
    <button onClick={handlePlaceOrder}>Buy</button>
    </>
  )
}

export default CartPage;