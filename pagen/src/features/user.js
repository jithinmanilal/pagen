import { BASE_URL } from "../context/Constants";
import Cookies from "js-cookie";
import axios from "axios";
import axiosInstance from "../context/AxiosInstance";

export const refresh = async () => {
  const refresh_token = Cookies.get("refresh_token"); // Get the refresh token from cookies

  if (!refresh_token) {
    // Handle the case when there's no refresh token
    console.error("No refresh token available.");
    return;
  }

  try {
    const response = await axios.post(`${BASE_URL}/api/token/refresh/`, {
      refresh: refresh_token,
    });

    if (response.status === 200) {
      // Token refresh successful, update the access token in cookies
      const { access } = response.data;
      Cookies.set("access_token", access);

      console.log("Token refresh successful");
    } else {
      // Handle any other responses, e.g., invalid refresh token
      console.log("Token refresh failed");
    }
  } catch (error) {
    // Handle any network or request errors
    console.error("Error refreshing token:", error);
  }
};

export const generatePassword = (body) => {
  return axiosInstance.post("/api/token/verify/", body);
};

// Function to retrieve user details
export const getUserDetails = async (userContext) => {
  const { setUser, setIsAuthenticated } = userContext;

  try {
    const response = await axiosInstance.get("/user/detail/");

    if (response.status === 200) {
      setUser(response.data);
      setIsAuthenticated(true);
      return response.data; // User details
    } else {
      return null; // User details not available
    }
  } catch (error) {
    console.error("Error retrieving user details:", error);
    return null;
  }
};

export const logout = (userContext) => {
  const { setUser, setIsAuthenticated, setRegistered } = userContext;
  setUser(null);
  setIsAuthenticated(false);
  setRegistered(false);
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};
