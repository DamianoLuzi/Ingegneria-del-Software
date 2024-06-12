import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Ristorante } from './interfaces/helper';
import HomePage from './pages/HomePage';
import LoginForm from './pages/LoginForm';
import RestaurantsPage from './pages/RestaurantsPage';
import MenuPage from './pages/MenuPage';
import SignUpPage from './pages/SignUpPage';
import { Utente } from './interfaces/helper';
import OrdersPage from './pages/OrdersPage';
import BalancePage from './pages/BalancePage';
import CartPage from './pages/CartPage';
import EditMenuPage from './pages/EditMenuPage';
import AccountPage from './pages/AccountPage';
import './styles/App.css'; // Import the CSS file for styling
import PasswordResetPage from './pages/PasswordResetPage';
import FavouritesPage from './pages/FavouritesPage';
import glovo from './styles/glovo.png'

function App() {
  
  const [restaurants, setRestaurants] = useState();
  const [user, setUser] = useState<Utente | null>();
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [products, setProducts] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [favouriteProducts, setFavouriteProducts] = useState<any>([])
  const [favouriteRestaurants, setFavouriteRestaurants] = useState<any>([])
  return (
    <Router>
        <nav className="navbar">
          <ul>
            <li>
            <Link to="/" style={{ display:"-ms-inline-flexbox" }}>
                <img src={glovo} alt="Home" style={{ width: '80px', height: '80px', borderRadius: '50%'}} />
            </Link>
            </li>
            {user && user.ruolo === 'cliente' && 
              <>
                <li>
                <Link to="/restaurants">Ristoranti</Link>
              </li>
              <li>
                <Link to="/favourites">Preferiti</Link>
              </li>
              </>
            }
            {user && user.ruolo === 'ristorante' && 
              <li>
                <Link to="/menu">Menu</Link>
              </li>
            }
            {user  && 
              <li>
                <Link to="/orders">Ordini</Link>
              </li>
            }
            {user && <li><Link to="/balance"> Wallet</Link></li>}
            {user && user.ruolo === 'cliente' && <li><Link to="/cart"> Carrello</Link></li>}
            {user && <li><Link to="/account">Account</Link></li>} 
            {user ? <li onClick={() => setUser(null)}><Link to="/login">Logout</Link></li> : <li><Link to="/login">Login</Link></li>}    
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginForm setUser={setUser} />} />
          <Route path="/restaurants" element={<RestaurantsPage user={user} restaurants={restaurants} setRestaurants={setRestaurants} setSelectedRestaurant={setSelectedRestaurant} favouriteRestaurants={favouriteRestaurants} setFavouriteRestaurants={setFavouriteRestaurants}/>} />
          <Route path="/:restaurantName/menu/" element={<MenuPage user={user} products={products} setProducts={setProducts} selectedRestaurant={selectedRestaurant} setCartItems={setCartItems} favouriteProducts={favouriteProducts} setFavouriteProducts={setFavouriteProducts}/>} /> 
          <Route path="/orders" element={<OrdersPage user={user} />} /> 
          <Route path="/balance" element={<BalancePage user={user} />} />
          <Route path="/signup" element={<SignUpPage user={user} setUser={setUser} />} />
          <Route path="/cart" element={<CartPage user={user} cartItems={cartItems} setCartItems={setCartItems} />} />
          <Route path="/menu" element={<EditMenuPage user={user} cartItems={cartItems} products={products} setProducts={setProducts} selectedRestaurant={selectedRestaurant} setCartItems={setCartItems} />} />
          <Route path="/account" element = {<AccountPage user={user} setUser={setUser}/>}/>
          <Route path="/resetpw" element = {<PasswordResetPage setUser={setUser}/>}/>
          <Route path="/favourites" element = {<FavouritesPage user={user} favouriteProducts={favouriteProducts} setFavouriteProducts={setFavouriteProducts}  favouriteRestaurants={favouriteRestaurants} setFavouriteRestaurants={setFavouriteRestaurants}/>}/>
        </Routes> 
    </Router>
  );
}

export default App;


