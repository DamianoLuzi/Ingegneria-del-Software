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
    props.setFavouriteProducts(props.user.favourite_items)
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
        setItemCount(prevItemCount => ({
          ...prevItemCount,
          [product.pk]: 1 
        }));
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
    console.log("user\n", props.user)
    props.setCartItems(selectedItems);
  }, [selectedItems]); 

  const handleToggleFavourite = async (item: any) => {
    props.user.favourite_items.map((p:any) => console.log(p, typeof p))
    const isFavourite = props.favouriteProducts.some((fav: any) => fav.pk === item.pk);
    console.log("is fav\n", isFavourite)
    try {
      if (isFavourite) {
        const res = await axios.delete(`http://localhost:8000/${props.user.ruolo}/${props.user.username}/favourite_products`,{
          data: item,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log("DEL res\n", res)
        props.setFavouriteProducts(props.favouriteProducts.filter((fav: any) => fav.pk !== item.pk));
        props.user.favourite_items = props.favouriteProducts.filter((fav: any) => fav.pk !== item.pk)
        console.log("updated favs\n",props.favouriteProducts)
      } else {
        await axios.post(`http://localhost:8000/${props.user.ruolo}/${props.user.username}/favourite_products`, item);
        props.setFavouriteProducts([...props.favouriteProducts, item]);
        props.user.favourite_items = [...props.favouriteProducts, item]
      }
    } catch (error) {
      console.error(`Error ${isFavourite ? 'removing from' : 'adding to'} favourites:`, error);
    }
  };
  return (
    <>
      <h1>Menu</h1>
      <div>
      <input
        type="text"
        placeholder="Filtra Prodotti"
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
                  <p>Descrizione: {product.description}</p>
                  <p>Prezzo: {product.price} €</p>
                  {/* selectedItems.includes(product) */ true && (
                    <div>
                      <button className="button" onClick={() => handleItemCountChange(product , itemCount[product.pk] ? itemCount[product.pk] + 1 : 1)}>+</button>
                      <span>{itemCount[product.pk] || 0}</span>
                      <button className="button"  onClick={() => handleItemCountChange(product, itemCount[product.pk] ? Math.max(itemCount[product.pk] - 1, 0) : 0)}>-</button>
                    </div>
                  )}
                  <button className="button"  onClick={() => handleCheckboxChange(product)}>
                    {selectedItems.includes(product) ? "Rimuovi dal Carrello" : "Aggiungi al Carrello"}
                  </button>
                  {
                    props.user && props.user.ruolo == "cliente" &&
                    <button className="button" onClick={() => handleToggleFavourite(product)}>
                    {props.favouriteProducts.some((fav: any) => fav.pk === product.pk) ? 'Rimuovi dai Preferiti' : 'Aggiungi ai Preferiti'}
                  </button>
                  }
                </div>
              </li>
            ))}
        </ul>
        {selectedItems.length !== 0 && <Link to={`/cart`}><button className="button">Vai al Carrello</button></Link>}
      </div>
    </>
  );
}

export default MenuPage;
