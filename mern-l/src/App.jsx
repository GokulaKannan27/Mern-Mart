import { useState } from 'react';
import './App.css';
import Login from './components/Login';
import Navbar from './components/Navbar/Navbar';
import PurchaseChart from './components/Analysis/PurchaseChart';
import UserTable from './components/Analysis/UserGrowthChart';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductManager from './components/Product/ProductManager';
import OrderManaging from './components/Order/OrderManaging';

function App() {

  return (
    <>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/pchart" element={<PurchaseChart />} />
          <Route path='/user' element={<UserTable/>} />
          <Route path='/manager' element={<ProductManager/>} />
          <Route path='/order' element={<OrderManaging/>} />
        </Routes>
      </div>
    </>
  )
}

export default App
