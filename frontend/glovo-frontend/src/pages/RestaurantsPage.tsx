import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import "../styles/App.css"
import res from "../styles/res.png";

function RestaurantsPage(props: any) {
  const [filterText, setFilterText] = useState('');
  useEffect(() => {
    const getRistoranti = async () => {
      const response = await axios.get('http://localhost:8000/restaurants')
      if (response) props.setRestaurants(response.data)
    }
    getRistoranti()
    props.setFavouriteRestaurants(props.user.favourite_restaurants)
  }, [])



  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value);
  };

  const handleToggleFavourite = async (restaurant: any) => {
    props.user.favourite_restaurants.map((p: any) => console.log(p, typeof p))
    const isFavourite = props.favouriteRestaurants.some((fav: any) => fav.username === restaurant.username);
    try {
      if (isFavourite) {
        const res = await axios.delete(`http://localhost:8000/${props.user.ruolo}/${props.user.username}/favourite_restaurants`, {
          data: restaurant,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        props.setFavouriteRestaurants(props.favouriteRestaurants.filter((fav: any) => fav.username !== restaurant.username));
        props.user.favourite_restaurants = props.favouriteRestaurants.filter((fav: any) => fav.username !== restaurant.username)
      } else {
        await axios.post(`http://localhost:8000/${props.user.ruolo}/${props.user.username}/favourite_restaurants`, restaurant);
        props.setFavouriteRestaurants([...props.favouriteRestaurants, restaurant]);
        props.user.favourite_restaurants = [...props.favouriteRestaurants, restaurant]
      }

    } catch (error) {
      console.error(`Error ${isFavourite ? 'removing from' : 'adding to'} favourites:`, error);
    }
  };


  return (
    <div>
      <input
        className="form-input"
        type="text"
        placeholder="Filtra Ristoranti"
        value={filterText}
        onChange={handleFilterChange}
      />
      <ul className="list">
        {props.restaurants &&
          props.restaurants
            .filter((restaurant: any) =>
              restaurant.username.toLowerCase().includes(filterText.toLowerCase())
            )
            .map((restaurant: any, index: any) => (
              <div className="card" style={{ display: 'flex', justifyContent: 'normal', alignItems: 'center' }}>
                <div>
                  <h1>{restaurant.username}</h1>
                  <p>Orari di Apertura: {restaurant.orarioApertura} - {restaurant.orarioChiusura}</p>
                  <p>Indirizzo: {restaurant.indirizzo}</p>
                  <Link to={`/${restaurant.username.toLowerCase().replace(/\s+/g, '')}/menu`}>
                    <button
                      className="button"
                      onClick={() => {
                        props.setSelectedRestaurant(restaurant); //globally updating selectedRestaurant
                        console.log("selected restaurant", restaurant)
                      }}
                    >
                      Menu
                    </button>
                  </Link>
                  {
                    props.user && props.user.ruolo == "cliente" &&
                    <button className="button" onClick={() => handleToggleFavourite(restaurant)}>
                      {props.favouriteRestaurants.some((fav: any) => fav.username === restaurant.username) ? 'Rimuovi dai Preferiti' : 'Aggiungi ai Preferiti'}
                    </button>
                  }
                </div>
                <img src={res} style={{ height: "250px", width: "250px", marginLeft: '400px' }} />
              </div>
            ))}
      </ul>
    </div>
  )
}

export default RestaurantsPage;