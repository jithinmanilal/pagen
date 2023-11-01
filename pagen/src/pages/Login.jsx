import { Link, Navigate } from "react-router-dom";
import axios from 'axios';

import { BASE_URL } from '../context/Constants';
import Layout from "../components/Layout";
import './Login.css';
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import axiosInstance from '../context/AxiosInstance';

const Login = () => {
  const { isAuthenticated, setIsAuthenticated, setUser } = useContext(UserContext);

  const [errors, setErrors] = useState({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

    const getUserDetails = async () => {
    try {
      const response = await axiosInstance.get('/user/detail/');
  
      if (response.status === 200) {
        setUser(response.data);
        return response.data; // User details
      } else {
        return null; // User details not available
      }
    } catch (error) {
      console.error('Error retrieving user details:', error);
      return null;
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    await axios.post(`${BASE_URL}/api/token/`, {
        email: email,
        password: password,
      })
      .then((response) => {
        if (response.status === 200) {
          const { access, refresh } = response.data;
          localStorage.setItem('access_token', access);
          localStorage.setItem('refresh_token', refresh);
          console.log('Login successful');
          getUserDetails();
          setIsAuthenticated(true);
        } else {
          console.log('Login failed');
        }
      })
      .catch((error) => {
        console.error('Error logging in:', error);
      });
  };

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <Layout title="Pagen | Login" content="Loginpage">
      <form onSubmit={onSubmit}>
        <div className="container">
          <h1>Login</h1>
          <p>Sign in to access your account.</p>
          <hr />
          {errors.general && (
            <div className="text-red-600 text-center mt-4 text-sm">
              {errors.general}
            </div>
          )}

          <label htmlFor="email">
            <b>Email</b>
          </label>
          <input
            type="text"
            placeholder="Enter Email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="psw">
            <b>Password</b>
          </label>
          <input
            type="password"
            placeholder="Enter Password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="registerbtn">
            Login
          </button>
        </div>

        <div className="container signin">
          <p style={{color:'black'}}>
            Dont have an account? <Link href="/register">Sign up</Link>
          </p>
        </div>
      </form>
    </Layout>
  );
};

export default Login;
