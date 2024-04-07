import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Ristorante } from './interfaces/helper';
import HomePage from './HomePage'
import LoginForm from './LoginForm';
import RestaurantsPage from './RestaurantsPage';
import MenuPage from './MenuPage';
import SignUpPage from './SignUpPage';
import { Utente } from './interfaces/helper';

function App() {
  
  const [restaurants, setRestaurants] = useState<Ristorante[]>()
  const [user, setUser] = useState<Utente>()
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [products, setProducts] = useState(null)
  return (
    <>
      <Router>
      <div>
        <nav  className="bg-dark">
          <ul>
            <li>
              <Link to="">Home</Link>
            </li>
              {user && user.ruolo === 'cliente' && 
                <li>
                  <Link to="/restaurants">Restaurants</Link>
                </li>
              }
              {user && user.ruolo === 'ristorante' && 
                <li>
                  <Link to="/orders">Orders</Link>
                </li>
              }
            <li>
            {`Logged in as ${user ? user.ruolo : ''} `} |{user ? <Link to="/login" > Logout</Link> : <Link to="/login">Login</Link> }
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="" element={<HomePage />} />
          <Route path="/login" element={<LoginForm setUser={setUser}/>}/>
          <Route path="/restaurants" element={<RestaurantsPage restaurants={restaurants} setRestaurants={setRestaurants} setSelectedRestaurant={setSelectedRestaurant}/>}/>
            <Route path="/:restaurantName/menu/" element={<MenuPage products={products} setProducts={setProducts} selectedRestaurant={selectedRestaurant}/>} />
            <Route path="/signup" element={<SignUpPage user={user} setUser={setUser}/>}/>
        </Routes>
      </div>
    </Router>
    </>
  )
}

export default App
