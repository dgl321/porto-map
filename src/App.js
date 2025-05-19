import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainMap from './MainMap';
import Places from './Places';
import Food from './Food';
import Essentials from './Essentials';
import './App.css';

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Map Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          color: '#666'
        }}>
          <h2>Something went wrong loading the map.</h2>
          <p>Please try refreshing the page.</p>
          <pre style={{
            textAlign: 'left',
            background: '#f5f5f5',
            padding: '10px',
            borderRadius: '4px',
            overflow: 'auto'
          }}>
            {this.state.error?.toString()}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const [apiKey, setApiKey] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const key = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    console.log('API Key available:', !!key);
    if (!key) {
      setError('Google Maps API key is missing');
    }
    setApiKey(key);
  }, []);

  if (error) {
    return (
      <div style={{
        padding: '20px',
        textAlign: 'center',
        color: '#666'
      }}>
        <h2>Configuration Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<MainMap />} />
          <Route path="/places" element={<Places />} />
          <Route path="/food" element={<Food />} />
          <Route path="/essentials" element={<Essentials />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
