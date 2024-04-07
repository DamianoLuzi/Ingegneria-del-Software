import axios from 'axios';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
function RestaurantsPage(props: any) {
  useEffect(() => {
    const getRistoranti = async () => {
      const response = await axios.get('http://localhost:8000/restaurants')
      console.log("restaurant response", response.data, typeof response.data)
      if(response) props.setRestaurants(response.data)
      console.log("props rest", props.restaurants)
    }
    getRistoranti()
  },[])
   // <a href={`/${restaurant.name.replace(/\s+/g, '').toLowerCase()}/menu`} className="btn btn-primary" onClick={() => displayMenu(restaurant)}>View Menu</a>
   //<h1 htmlFor="items">Choose your favorite restaurant!</h1>
  return (
    <div>
    <br />
    <ul>
      {props.restaurants && 
        props.restaurants.map((restaurant:any, index:any) => (
        <div key={index} className="col-md-4">
          <div className="card mb-3">
            <div className="card-body">
              <h1 className="card-title">{restaurant.fields.name}</h1>
              <p className="card-text">Location: {restaurant.fields.position}</p> 
              <Link to={`/${restaurant.fields.name.toLowerCase().replace(/\s+/g, '')}/menu`}>
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