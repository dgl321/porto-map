import React, { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer, Marker, InfoWindow } from '@react-google-maps/api';
import './App.css';

const OPO = { lat: 41.2421, lng: -8.6788 }; // Porto Airport
const FORMOSA = { lat: 41.1486, lng: -8.6062 }; // Rua Formosa 414

const containerStyle = {
  width: '100vw',
  height: '100vh',
  margin: 0,
  padding: 0,
};

function App() {
  const [directions, setDirections] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  const directionsCallback = useCallback((res) => {
    if (res !== null && res.status === 'OK') {
      setDirections(res);
    }
  }, []);

  return (
    <div className="App" style={{ width: '100vw', height: '100vh', margin: 0, padding: 0 }}>
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={OPO}
          zoom={12}
        >
          <Marker
            position={OPO}
            label="OPO"
            onClick={() => setActiveMarker('airport')}
          />
          {activeMarker === 'airport' && (
            <InfoWindow
              position={OPO}
              onCloseClick={() => setActiveMarker(null)}
            >
              <div>
                <strong>Airport</strong>
                <br />
                Francisco Sá Carneiro Airport (OPO)
              </div>
            </InfoWindow>
          )}

          <Marker
            position={FORMOSA}
            label="Rua Formosa 414"
            onClick={() => setActiveMarker('airbnb')}
          />
          {activeMarker === 'airbnb' && (
            <InfoWindow
              position={FORMOSA}
              onCloseClick={() => setActiveMarker(null)}
            >
              <div>
                <strong>Airbnb</strong>
                <br />
                Rua Formosa 414, Porto
              </div>
            </InfoWindow>
          )}

          {!directions && (
            <DirectionsService
              options={{
                destination: FORMOSA,
                origin: OPO,
                travelMode: 'TRANSIT'
              }}
              callback={directionsCallback}
            />
          )}
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default App;
