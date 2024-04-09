import axios from "axios";
import { useEffect, useState } from "react";
import '../styles/App.css';
import { Link } from "react-router-dom";
function MenuPage(props:any) {

  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  
  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/${props.selectedRestaurant.fields.name}/menu`);
        console.log("menu response", response);
        if (response) props.setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    console.log("selected restaurant", props.selectedRestaurant)
    getProducts()
  }, [])

  const handleCheckboxChange = (product: any) => {
    setSelectedItems(prevSelectedItems => {
      const isSelected = prevSelectedItems.includes(product);
      if (isSelected) {
        // If selected, remove it from the selectedItems array
        return prevSelectedItems.filter(item => item !== product);
      } else {
        // If not selected, add it to the selectedItems array
        return [...prevSelectedItems, product];
      }
    });
  };

  useEffect(() => {
    props.setCartItems(selectedItems);
  }, [selectedItems]);

  /* <label>Add to cart:</label>
            <input
              type="checkbox"
              checked={selectedItems.includes(product)}
              onChange={() => handleCheckboxChange(product)}
              /> */

  return (
    <>
    <h1>Menu</h1>
      <div className ="container">
        <ul className="card-list">
        {props.products && 
        props.products.map((product: any, index: number) => (
          <li className="card">
            <div key={index}>
            <h2>{product.fields.name}</h2>
            <p>Description: {product.fields.description}</p>
            <p>Price: {product.fields.price} €</p>
            <button onClick={() => handleCheckboxChange(product)}>
            {selectedItems.includes(product) ? "Remove from Cart" : "Add to Cart"}
            </button>
          </div>
          </li>
        ))}
        </ul>
        {selectedItems.length != 0 && <Link to={`/cart`}><button>Check your Cart</button></Link>}
      </div>
    </>
  )
}

export default MenuPage;