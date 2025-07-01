import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Despesas from './pages/Despesas';
import Register from './pages/Register';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/despesas" element={<Despesas />} />
    </Routes>
  </Router>
);

export default App;