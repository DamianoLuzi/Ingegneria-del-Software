import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import "../styles/App.css"
function RestaurantsPage(props: any) {
  const [filterText, setFilterText] = useState(''); 
  useEffect(() => {
    const getRistoranti = async () => {
      const response = await axios.get('http://localhost:8000/restaurants')
      if(response) props.setRestaurants(response.data)
    }
    getRistoranti()
  },[])

 

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value); 
  };


  return (
    <div>
      <input
        type="text"
        placeholder="Filter by restaurant name"
        value={filterText}
        onChange={handleFilterChange}
      />
    <br />
    <ul>
      {props.restaurants && 
        props.restaurants
        .filter((restaurant: any) =>
          restaurant.username.toLowerCase().includes(filterText.toLowerCase())
        )
        .map((restaurant:any, index:any) => (
        <div key={index} className="col-md-4">
          <div className="card mb-3">
            <div className="card-body">
              <h1 className="card-title">{restaurant.username}</h1>
              <p>Opening Hours: {restaurant.orarioApertura} - {restaurant.orarioChiusura}</p>
              <p>Indirizzo: {restaurant.indirizzo}</p>
              <Link to={`/${restaurant.username.toLowerCase().replace(/\s+/g, '')}/menu`}>
              <button
                className="button"
                onClick={() => {
                  props.setSelectedRestaurant(restaurant); //globally updating selectedRestaurant
                  console.log("selected restaurant", restaurant)
                }}
              >
                View Menu
              </button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </ul>
    
    </div>
  ) 
}

export default RestaurantsPage;