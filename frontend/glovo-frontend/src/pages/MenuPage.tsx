import axios from "axios";
import { useEffect, useState } from "react";
import '../styles/App.css';
import { Link } from "react-router-dom";

function MenuPage(props:any) {
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [itemCount, setItemCount] = useState<{[key: string]: number}>({});
  const [filterText, setFilterText] = useState('')
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value); // Update filter text state when input changes
  };


  useEffect(() => {
    const getProducts = async () => {
      try {
        let response = await axios.get(`http://localhost:8000/${props.selectedRestaurant.name}/menu`);
        if(props.user.ruolo === 'ristorante') response = await axios.get(`http://localhost:8000/${props.selectedRestaurant.fields.name}/menu`);
        if (response) props.setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    getProducts()
  }, [])

  const handleCheckboxChange = (product: any) => {
    setSelectedItems(prevSelectedItems => {
      const isSelected = prevSelectedItems.includes(product);
      if (isSelected) {
      const updatedItems = prevSelectedItems.filter(item => item !== product);
      setItemCount(prevItemCount => ({
        ...prevItemCount,
        [product.pk]: 0 
      }));
      return updatedItems;
      } else {
        return [...prevSelectedItems, product];
      }
    });
  };

  const handleItemCountChange = (product: any, value: number) => {
    setItemCount(prevState => ({
      ...prevState,
      [product.pk]: value
    }));
    setSelectedItems(prevSelectedItems => {
      const updatedItems = [];
      for (let i = 0; i < value; i++) {
        updatedItems.push(product);
      }
      return [...prevSelectedItems.filter(item => item.pk !== product.pk), ...updatedItems];
    });
  };

  useEffect(() => {
    props.setCartItems(selectedItems);
  }, [selectedItems]); 

  return (
    <>
      <h1>Menu</h1>
      <div>
      <input
        type="text"
        placeholder="Filter by product name"
        value={filterText}
        onChange={handleFilterChange}
      />
        <ul className="card-list">
          {props.products && 
            props.products
            .filter((product: any) =>
              product.name.toLowerCase().includes(filterText.toLowerCase())
            )
            .map((product: any, index: number) => (
              <li key={index}>
                <div className="card">
                  <h2>{product.name}</h2>
                  <p>Description: {product.description}</p>
                  <p>Price: {product.price} €</p>
                  {/* selectedItems.includes(product) */ true && (
                    <div>
                      <button onClick={() => handleItemCountChange(product , itemCount[product.pk] ? itemCount[product.pk] + 1 : 1)}>+</button>
                      <span>{itemCount[product.pk] || 0}</span>
                      <button onClick={() => handleItemCountChange(product, itemCount[product.pk] ? Math.max(itemCount[product.pk] - 1, 0) : 0)}>-</button>
                    </div>
                  )}
                  <button onClick={() => handleCheckboxChange(product)}>
                    {selectedItems.includes(product) ? "Remove from Cart" : "Add to Cart"}
                  </button>
                </div>
              </li>
            ))}
        </ul>
        {selectedItems.length !== 0 && <Link to={`/cart`}><button>Check your Cart</button></Link>}
      </div>
    </>
  );
}

export default MenuPage;
