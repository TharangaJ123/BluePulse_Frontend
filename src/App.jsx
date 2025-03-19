import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import React,{ useState } from "react";

import './App.css'
import OnlineStoreHome from "./components/OnlineStoreHome";
import Product from "./components/Product";
import ShoppingCart from "./components/ShoppingCart";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<OnlineStoreHome/>} />
          <Route path="/singleProduct/:id" element={<Product/>} />
          <Route path="/cart" element={<ShoppingCart/>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
