import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import React,{ useState } from "react";

import './App.css'
import OnlineStoreHome from "./components/OnlineStoreHome";
import Product from "./components/Product";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
      <nav className="bg-gray-800 text-white p-4 flex justify-between">
        <Link to="/" className="text-lg font-bold">Online Store</Link>
      </nav>
      <Routes>
        <Route path="/" element={<OnlineStoreHome/>} />
        <Route path="/product/:id" element={<Product/>} />
      </Routes>
      </Router>
    </>
  )
}

export default App
