/* import axios from "axios";
import { useState, useEffect} from "react";
import "../styles/App.css"
function CartPage (props: any) {
  const [message, setMessage] = useState('')
  const [itemCount, setItemCount] = useState<{[key: string]: number}>({});
  const [error, setError] = useState('')
  console.log("cart items", props.cartItems)

  const handleItemCountChange = (product: any, value: number) => {
    setItemCount(prevState => ({
      ...prevState,
      [product.pk]: value
    }));
    
  };

  const handlePlaceOrder = async () => {
   try {
    const orderData = {
      'user' : props.user,
      'items' : props.cartItems,
      'price': props.cartItems.reduce((total: number, item: any) => total + item.price, 0)
    }
    console.log("cart items\n", props.cartItems)
    const response = await axios.post(`http://localhost:8000/${props.user.ruolo}/${props.user.username}/orders`, orderData)
    if(response) {
      setMessage('Order successfully placed!')
      props.setCartItems([])
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
    <ul className="card-list">
    {props.cartItems && props.cartItems.map((item:any) => (
      <li className="card">
        <h3>{item.name} - {item.price} €</h3> 
        {(
          <div>
          <button className="button" onClick={() => handleItemCountChange(item , itemCount[item.pk] ? itemCount[item.pk] + 1 : 1)}>+</button>
          <span>{itemCount[item.pk] || 0}</span>
          <button className="button"  onClick={() => handleItemCountChange(item, itemCount[item.pk] ? Math.max(itemCount[item.pk] - 1, 0) : 0)}>-</button>
          </div>
        )}
      </li>
    ))}
    </ul>
    <h2>Total: {props.cartItems.reduce((total: number, item: any) => total + item.price, 0)} €</h2>
    {props.cartItems.length != 0 && <button className="button" onClick={handlePlaceOrder}>Pay</button>}
    {<button className="button" onClick={() => props.setCartItems([])}>Cancel</button>}
    </>
  )
}

export default CartPage; */
/* 
import axios from "axios";
import { useState, useEffect } from "react";
import "../styles/App.css";

function CartPage(props: any) {
  const [message, setMessage] = useState('');
  const [itemCount, setItemCount] = useState<Record<string, number>>({});
  const [error, setError] = useState('');
  console.log("cart items", props.cartItems);

  useEffect(() => {
    const countItems = props.cartItems.reduce((acc: Record<string, number>, item: any) => {
      acc[item.pk] = (acc[item.pk] || 0) + 1;
      return acc;
    }, {});
    setItemCount(countItems);
  }, [props.cartItems]);

  const handleItemCountChange = (product: any, value: number) => {
    setItemCount(prevState => {
      const updatedCount = { ...prevState, [product.pk]: value } as Record<string, number>;

      // Update the cart items
      let updatedCartItems = [...props.cartItems];
      const itemIndex = updatedCartItems.findIndex((item: any) => item.pk === product.pk);

      if (value === 0) {
        // Remove item if count is zero
        updatedCartItems = updatedCartItems.filter((item: any) => item.pk !== product.pk);
      } else {
        // Add or update the item in the cart
        if (itemIndex !== -1) {
          updatedCartItems = updatedCartItems.filter((item: any) => item.pk !== product.pk);
          for (let i = 0; i < value; i++) {
            updatedCartItems.push(product);
          }
        } else {
          for (let i = 0; i < value; i++) {
            updatedCartItems.push(product);
          }
        }
      }

      props.setCartItems(updatedCartItems);

      return updatedCount;
    });
  };

  const handleCheckboxChange = (product: any) => {
    setItemCount(prevState => {
      const updatedCount = { ...prevState };

      // Remove item if it is unchecked
      if (updatedCount[product.pk]) {
        delete updatedCount[product.pk];
        props.setCartItems((prevItems:any) => prevItems.filter((item :any) => item.pk !== product.pk));
      }

      return updatedCount;
    });
  };

  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        user: props.user,
        items: Object.keys(itemCount).map(pk => ({
          ...props.cartItems.find((item: any) => item.pk == pk),
          count: itemCount[pk]
        })),
        price: Object.keys(itemCount).reduce((total, pk) => {
          const item = props.cartItems.find((item: any) => item.pk == pk);
          return total + (item.price * itemCount[pk]);
        }, 0)
      }
      console.log("order data\n", orderData);
      const response = await axios.post(`http://localhost:8000/${props.user.ruolo}/${props.user.username}/orders`, orderData);
      if (response) {
        setMessage('Order successfully placed!');
        props.setCartItems([]);
      }
    } catch (error: any) {
      console.log("POST error", error);
      if (error.response && (error.response.status === 500 || error.response.status === 400)) {
        setError(error.response.data);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  const getItemTotal = () => {
    return Object.keys(itemCount).reduce((total, pk) => {
      const item = props.cartItems.find((item: any) => item.pk == pk);
      return total + (item.price * itemCount[pk]);
    }, 0);
  };

  return (
    <>
      {message && <h1>{message}</h1>}
      {error && <h1>Error: {error}</h1>}
      <h1>Your cart:</h1>
      <ul className="card-list">
        {Object.keys(itemCount).map(pk => {
          const item = props.cartItems.find((item: any) => item.pk == pk);
          return (
            <li className="card" key={pk}>
              <h3>{item.name} - {item.price} €</h3>
              <div>
                <button className="button" onClick={() => handleItemCountChange(item, itemCount[pk] + 1, true)}>+</button>
                <span>{itemCount[pk]}</span>
                <button className="button" onClick={() => handleItemCountChange(item, Math.max(itemCount[pk] - 1, 0), false)}>-</button>
                <div>
                  <button className="button" onClick={() => handleCheckboxChange(item)}>
                    Remove From Cart
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <h2>Total: {getItemTotal()} €</h2>
      {Object.keys(itemCount).length !== 0 && <button className="button" onClick={handlePlaceOrder}>Pay</button>}
      <button className="button" onClick={() => props.setCartItems([])}>Cancel</button>
    </>
  );
}

export default CartPage; */

import axios from "axios";
import { useState, useEffect } from "react";
import "../styles/App.css";

function CartPage(props: any) {
  const [message, setMessage] = useState('');
  const [itemCount, setItemCount] = useState<Record<string, number>>({});
  const [error, setError] = useState('');
  console.log("cart items", props.cartItems);

  useEffect(() => {
    const countItems = props.cartItems.reduce((acc: Record<string, number>, item: any) => {
      acc[item.pk] = (acc[item.pk] || 0) + 1;
      return acc;
    }, {});
    setItemCount(countItems);
  }, [props.cartItems]);

  const handleItemCountChange = (product: any, value: number) => {
    setItemCount(prevState => {
      const updatedCount = { ...prevState, [product.pk]: value } as Record<string, number>;

      // Update the cart items
      let updatedCartItems = [...props.cartItems];
      const itemIndex = updatedCartItems.findIndex((item: any) => item.pk === product.pk);

      if (value === 0) {
        // Remove item if count is zero
        updatedCartItems = updatedCartItems.filter((item: any) => item.pk !== product.pk);
      } else {
        // Add or update the item in the cart
        if (itemIndex !== -1) {
          updatedCartItems = updatedCartItems.filter((item: any) => item.pk !== product.pk);
          for (let i = 0; i < value; i++) {
            updatedCartItems.push(product);
          }
        } else {
          for (let i = 0; i < value; i++) {
            updatedCartItems.push(product);
          }
        }
      }

      props.setCartItems(updatedCartItems);

      return updatedCount;
    });
  };

  const handleCheckboxChange = (product: any) => {
    setItemCount(prevState => {
      const updatedCount = { ...prevState };

      // Remove item if it is unchecked
      if (updatedCount[product.pk]) {
        delete updatedCount[product.pk];
        props.setCartItems((prevItems: any) => prevItems.filter((item: any) => item.pk !== product.pk));
      }

      return updatedCount;
    });
  };

  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        user: props.user,
        items: Object.keys(itemCount).map(pk => ({
          ...props.cartItems.find((item: any) => item.pk == pk),
          count: itemCount[pk]
        })),
        price: Object.keys(itemCount).reduce((total, pk) => {
          const item = props.cartItems.find((item: any) => item.pk == pk);
          return total + (item.price * itemCount[pk]);
        }, 0)
      }
      console.log("order data\n", orderData);
      const response = await axios.post(`http://localhost:8000/${props.user.ruolo}/${props.user.username}/orders`, orderData);
      if (response) {
        setMessage('Order successfully placed!');
        props.setCartItems([]);
      }
    } catch (error: any) {
      console.log("POST error", error);
      if (error.response && (error.response.status === 500 || error.response.status === 400)) {
        setError(error.response.data);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  const getItemTotal = () => {
    return Object.keys(itemCount).reduce((total, pk) => {
      const item = props.cartItems.find((item: any) => item.pk == pk);
      return total + (item.price * itemCount[pk]);
    }, 0);
  };

  return (
    <>
      {message && <h1>{message}</h1>}
      {error && <h1>Error: {error}</h1>}
      <h1>Your cart:</h1>
      <ul className="card-list">
        {Object.keys(itemCount).map(pk => {
          const item = props.cartItems.find((item: any) => item.pk == pk);
          if(!item) return null
          return (
            <li className="card" key={pk}>
              <h3>{item.name} - {item.price} €</h3>
              <div>
                <button className="button" onClick={() => handleItemCountChange(item, itemCount[pk] + 1)}>+</button>
                <span>{itemCount[pk]}</span>
                <button className="button" onClick={() => handleItemCountChange(item, Math.max(itemCount[pk] - 1, 0))}>-</button>
                <div>
                  <button className="button" onClick={() => handleCheckboxChange(item)}>
                    Remove From Cart
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <h2>Total: {getItemTotal()} €</h2>
      {Object.keys(itemCount).length !== 0 && <button className="button" onClick={handlePlaceOrder}>Pay</button>}
      <button className="button" onClick={() => props.setCartItems([])}>Cancel</button>
    </>
  );
}

export default CartPage;
