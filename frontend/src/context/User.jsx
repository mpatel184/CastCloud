import { createContext, useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const UserContext = createContext();

const config = {
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState([]);
  const [isAuth, setIsAuth] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  async function registerUser(
    name,
    email,
    password,
    navigate,
    fetchPodcasts,
    fetchAlbums
  ) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/user/register",
        {
          name,
          email,
          password,
        },
        config
      );

      toast.success(data.message);
      setUser(data.user);
      // console.log(data);

      setIsAuth(true);
      setBtnLoading(false);
      navigate("/");
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || error.message || "Registration failed"
      );
      setBtnLoading(false);
    }
  }

  async function loginUser(
    email,
    password,
    navigate,
    fetchPodcasts,
    fetchAlbums
  ) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/user/login",
        {
          email,
          password,
        },
        config
      );

      toast.success(data.message);
      setUser(data.user);
      setIsAuth(true);
      setBtnLoading(false);
      navigate("/");
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || error.message || "Login failed"
      );
      setBtnLoading(false);
    }
  }

  async function fetchUser() {
    try {
      // console.log("hii")
      const { data } = await axios.get(
        "http://localhost:5000/api/user/me",
        config
      );

      console.log(data);
      setUser(data);
      setIsAuth(true);
      setLoading(false);
    } catch (error) {
      // console.log("ddddddddddddd",error);
      setIsAuth(false);
      setLoading(false);
    }
  }

  async function logoutUser() {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/user/logout",
        config
      );

      window.location.reload();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function addToPlaylist(id) {
    try {
      console.log(id);
  
      const { data } = await axios.post(
        `http://localhost:5000/api/user/podcast/${id}`,
        {},  
        config 
      );      
  
      toast.success(data.message);
      fetchUser();  
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding to playlist");
    }
  }
  
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{ registerUser, user, isAuth, btnLoading, loading, loginUser,logoutUser, addToPlaylist}}
    >
      {children} <Toaster />
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);
