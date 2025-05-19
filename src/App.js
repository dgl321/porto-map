import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import MainMap from './MainMap';
import Places from './Places';
import Food from './Food';
import Essentials from './Essentials';

function App() {
  return (
    <Router>
      <Helmet>
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://porto-map.netlify.app/" />
        <meta property="og:title" content="Porto Map" />
        <meta property="og:description" content="Interactive map of Porto" />
        <meta property="og:image" content="https://porto-map.netlify.app/porto.jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Porto Map" />
        <meta property="og:site_name" content="Porto Map" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://porto-map.netlify.app/" />
        <meta name="twitter:title" content="Porto Map" />
        <meta name="twitter:description" content="Interactive map of Porto" />
        <meta name="twitter:image" content="https://porto-map.netlify.app/porto.jpeg" />
      </Helmet>
      <Routes>
        <Route path="/" element={<MainMap />} />
        <Route path="/places" element={<Places />} />
        <Route path="/food" element={<Food />} />
        <Route path="/essentials" element={<Essentials />} />
      </Routes>
    </Router>
  );
}

export default App;
