import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainMap from './MainMap';
import Places from './Places';
import Food from './Food';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainMap />} />
        <Route path="/places" element={<Places />} />
        <Route path="/food" element={<Food />} />
      </Routes>
    </Router>
  );
}

export default App;
