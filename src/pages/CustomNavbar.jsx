import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router
import './Navbar.css'; // Import custom CSS styles
import ProductSearch from './ProductSearch';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from "firebase/auth";
import { app } from '../firebase';

const NavBar = () => {
  const remember = localStorage.getItem('rememberMe');
  const user = localStorage.getItem('userEmail')
  const id = localStorage.getItem('userId')
  const auth = getAuth(app);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const handleLogout = () => {
    console.log(auth)
    signOut(auth)
      .then(() => {
        console.log('Logged out');
        const remember = localStorage.getItem('rememberMe');
        localStorage.clear();
        navigate('/login');
      })
      .catch((error) => {
        // Handle logout error
        console.error('Logout error:', error);
      });
  };


  const handleSearch = () => {
    navigate(`/search?query=${searchTerm}`);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/dashboard"><span style={{fontSize:'40px'}}>F</span>urniture <span style={{fontSize:'40px'}}>C</span>ollection</Link>
      </div>
      
      <ul className="navbar-links">
        <li className='navbar-innerlinks home-links'>
          <Link to="/dashboard">Home</Link>
        </li>
        <li className='navbar-innerlinks'>
          <Link to="/classification">Furniture Classification</Link>
        </li>
        <li className='navbar-innerlinks'>
          <Link to="/cart">Cart</Link>
        </li>
        <li className='navbar-innerlinks'>
          <Link to="/rating">Rate Our App</Link>
        </li>
        <li className='navbar-innerlinks'>
        <div className='navbar'>
        <div className="input-group" style={{marginTop:'2px'}}>
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div> 
        </li> 

        <li>
          <button className="navbar-logout" onClick={handleLogout}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
