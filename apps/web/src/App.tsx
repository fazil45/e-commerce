import { Route, Routes } from 'react-router-dom';
import './index.css'
import Home from './pages/Home';
import Collection from './pages/Collection';
import About from './pages/About';
import Contact from './pages/Contact';
import Product from './pages/Product';
import Cart from './pages/Cart';
import PlaceOrder from './pages/PlaceOrder';
import Order from './pages/Orders';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';
import { ToastContainer } from "react-toastify"
import "react-toastify/ReactToastify.css"
import Auth from './pages/Auth';

function App() {


  return (
    <>
      <div className="px-4  sm:px-[5vw] md:px-[7vw] lg:px-[9vw]" >
        <ToastContainer position='top-center' />
        <NavBar/> 
        <SearchBar/>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/collection" element={<Collection/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/contact" element={<Contact/>} />
          <Route path="/product/:productId" element={<Product/>} />
          <Route path="/cart" element={<Cart/>} />
          <Route path="/auth" element={<Auth/>} />
          <Route path="/place-order" element={<PlaceOrder/>} />
          <Route path="/orders" element={<Order/>} />
        </Routes>
        <Footer/>
      </div>
    </>
  )
}

export default App

