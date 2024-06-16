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
      let updatedCartItems = [...props.cartItems];
      const itemIndex = updatedCartItems.findIndex((item: any) => item.pk === product.pk);

      if (value === 0) {
        updatedCartItems = updatedCartItems.filter((item: any) => item.pk !== product.pk);
      } else {
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
      const response = await axios.post(`http://localhost:8000/${props.user.ruolo}/${props.user.username}/orders`, orderData);
      if (response) {
        setMessage('Ordine Registrato Con Successso!');
        props.setCartItems([]);
      }
    } catch (error: any) {
      if (error.response && (error.response.status === 500 || error.response.status === 400)) {
        setError(error.response.data);
      } else {
        setError('Si è verificato un errore');
      }
    }
  };

  const getItemTotal = () => {
    if (props.cartItems.length == 0) return 0;
    return Object.keys(itemCount).reduce((total, pk) => {
      const item = props.cartItems.find((item: any) => item.pk == pk);
      return total + (item.price * itemCount[pk]);
    }, 0);
  };

  return (
    <div>
      {message && <h1>{message}</h1>}
      {error && <h1>Error: {error}</h1>}
      <h1>Il tuo Carrello:</h1>
      <ul className="list">
        {props.cartItems && (
          <>
            {Object.keys(itemCount).map(pk => {
              const item = props.cartItems.find((item: any) => item.pk == pk);
              if (!item) return null
              return (
                <li className="card" key={pk}>
                  <h3>{item.name} - {item.price} €</h3>
                  <div>
                    <button className="button" onClick={() => handleItemCountChange(item, itemCount[pk] + 1)}>+</button>
                    <span>{itemCount[pk]}</span>
                    <button className="button" onClick={() => handleItemCountChange(item, Math.max(itemCount[pk] - 1, 0))}>-</button>
                    <div>
                      <button className="button" onClick={() => handleCheckboxChange(item)}>
                        Rimuovi
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </>
        )}
      </ul>
      <h2>Totale: {getItemTotal()} €</h2>
      {Object.keys(itemCount).length !== 0 && <button className="button" onClick={handlePlaceOrder}>Conferma</button>}
      <button className="button" onClick={() => props.setCartItems([])}>Annulla</button>
    </div>
  );
}

export default CartPage;
