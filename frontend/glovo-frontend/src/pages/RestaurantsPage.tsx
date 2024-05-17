import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
function RestaurantsPage(props: any) {
  const [filterText, setFilterText] = useState(''); // State for filter text
  useEffect(() => {
    const getRistoranti = async () => {
      const response = await axios.get('http://localhost:8000/restaurants')
      console.log("restaurant response", response.data)
      if(response) props.setRestaurants(response.data)
      console.log("props rest", props.restaurants)
    }
    getRistoranti()
  },[])

 

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value); // Update filter text state when input changes
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
              <p className="card-text">Location: {restaurant.posizione}</p> 
              <p>Opening Hours: {restaurant.orarioApertura} - {restaurant.orarioChiusura}</p>
              <Link to={`/${restaurant.username.toLowerCase().replace(/\s+/g, '')}/menu`}>
              <button
                className="btn btn-primary"
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