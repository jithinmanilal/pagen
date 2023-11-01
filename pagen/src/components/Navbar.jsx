import { NavLink, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import './Navbar.css';
import { logout } from '../features/user';

const Navbar = () => {
  const { isAuthenticated } = useContext(UserContext);
  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  const onClick = () => {
    if (isAuthenticated) {
      logout(userContext);
      navigate("/");
    }
  };  

  return (
    <div className="topnav">
      <NavLink to="/" style={{fontSize:'20px', backgroundColor:'#063b75', fontWeight:'bold'}}>
        Pa-Gen
      </NavLink>
      <div className="right-links">
        {isAuthenticated ? (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <a href="#" className="logout" onClick={onClick} >Logout</a>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
