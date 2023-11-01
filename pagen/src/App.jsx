import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { useContext, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "./context/Constants";
import { getUserDetails } from "./features/user";
import { UserContext } from "./context/UserContext";

function App() {
  const userContext = useContext(UserContext);

  useEffect(() => {
    const verifyAccessToken = async () => {
      const access_token = localStorage.getItem("access_token");
      try {
        const response = await axios.post(`${BASE_URL}/api/token/verify/`, {
          token: access_token,
        });

        if (response.status === 200) {
          getUserDetails(userContext);
          return true; // Access token is valid
        } else {
          return false; // Access token is not valid
        }
      } catch (error) {
        console.error("Error verifying access token:", error);
        return false;
      }
    };

    verifyAccessToken();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
