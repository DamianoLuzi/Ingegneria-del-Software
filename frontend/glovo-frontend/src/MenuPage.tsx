import axios from "axios";
import { useEffect } from "react";

function MenuPage(props:any) {
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
  return (
    <>
    <h1>Menu</h1>
      <div>
        {props.products && 
        props.products.map((product: any, index: number) => (
          <div key={index}>
            <h2>{product.fields.name}</h2>
            <p>Description: {product.fields.description}</p>
            <p>Price: {product.fields.price} €</p>
          </div>
        ))}
      </div>
    </>
  )
}

export default MenuPage;