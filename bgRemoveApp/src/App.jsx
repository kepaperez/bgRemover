import { useState } from 'react'
import Nav from './components/Nav';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Tool from './pages/Tool';
import Home from './pages/Home';
import MyImages from './pages/MyImages';
import './App.css'




function App() {
  return ( 
      <BrowserRouter>
      <Routes>
          <Route path="/" element={<Nav />}>
            <Route index element={<Home />}></Route>
            <Route path="tool" element={<Tool />}></Route>
            <Route path="images" element={<MyImages />}></Route>
            **<Route path="*" element={<h1>404</h1>}></Route>**
          </Route>
        </Routes>
      </BrowserRouter>
  )
}

export default App
