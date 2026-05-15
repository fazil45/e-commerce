import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import { useEffect, useState } from "react";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify";
import axios from "axios";
import { backendUrl } from "./config/exports";
import "./index.css"

export const currency = '$'

function App() {
  const [token, setToken] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/auth/verify`,
          {
            withCredentials: true,
            
          },
          
        );

        if (response.data.success) {
          setToken(true);
        }
      } catch (error) {
        setToken(false);
      }
    };

    verifyToken();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {token ? (
        <>
          <ToastContainer position="top-center" />
          <Navbar />
          <hr />
          <div className="flex w-full">
            <Sidebar />
            <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-4 text-gray-600 text-base">
              <Routes>
                <Route path="/add" element={<Add />} />
                <Route path="/list" element={<List />} />
                <Route path="/orders" element={<Orders />} />
              </Routes>
            </div>
          </div>
        </>
      ) : (
        <>
          <ToastContainer position="top-center" />
          <Login />
        </>
      )}
    </div>
  );
}

export default App;

