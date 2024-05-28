import axios from "axios";
import { useEffect, useState } from "react";
import '../styles/App.css'

function FavouritesPage(props: any) {
  //const [favouriteProducts, setFavouriteProducts] = useState([]);
  //const [favouriteRestaurants, setFavouriteRestaurants] = useState([]);
  const [filterText, setFilterText] = useState('');

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value); // Update filter text state when input changes
  };

  useEffect(() => {
    const fetchFavourites = async () => {
      const productsResponse = await axios.get(`http://localhost:8000/${props.user.ruolo}/${props.user.username}/favourite_products`);
      const restaurantsResponse = await axios.get(`http://localhost:8000/${props.user.ruolo}/${props.user.username}/favourite_restaurants`);

      if (productsResponse) props.setFavouriteProducts(productsResponse.data);
      if (restaurantsResponse) props.setFavouriteRestaurants(restaurantsResponse.data);
    };
    fetchFavourites();
  }, [props.user.ruolo, props.user.username]);


  
  return (
    <>
      <h1>Your Favourites:</h1>
      <div>
        <input
          type="text"
          placeholder="Filter favourites"
          value={filterText}
          onChange={handleFilterChange}
        />
        
        <h2>Favourite Products:</h2>
        <ul className="card-list">
          {props.favouriteProducts
            /* .filter((product: any) =>
              product.name.toLowerCase().includes(filterText.toLowerCase())
            ) */
            .map((product: any, index: number) => (
              <li key={index} className="card">
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <p>Price: {product.price} €</p>
              </li>
            )) }
        </ul> 

        <h2>Favourite Restaurants:</h2>
        <ul className="card-list">
          {props.favouriteRestaurants
            .filter((restaurant: any) =>
              restaurant.name.toLowerCase().includes(filterText.toLowerCase())
            )
            .map((restaurant: any, index: number) => (
              <li key={index} className="card">
                <h2>{restaurant.name}</h2>
                <p>{restaurant.address}</p>
                <p>{restaurant.description}</p>
              </li>
            ))}
        </ul>
      </div>
    </>
  );
}

export default FavouritesPage;
