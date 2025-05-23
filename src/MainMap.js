import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer, Marker, InfoWindow } from '@react-google-maps/api';
import './App.css';
import './MapStyles.css';
import FloatingMenu from './FloatingMenu';
import { applyGestureHandlingFix } from './GoogleMapsController';

const AEROPORTO_METRO = { lat: 41.236893482066556, lng: -8.670332547049686 }; // Aeroporto Metro Station entrance
const FORMOSA = { lat: 41.14916943789735, lng: -8.609004400792529 }; // R. Formosa 414 1, 4000-249 Porto, Portugal (Airbnb)

// Define map container style directly in the component
const mapContainerStyle = {
    width: '100%',
    height: '100%',
};

function MainMap() {
    const [directions, setDirections] = useState(null);
    const [steps, setSteps] = useState([]);
    const [activeMarker, setActiveMarker] = useState(null);
    const [showDirections, setShowDirections] = useState(false);
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    const directionsCallback = useCallback((res) => {
        if (res !== null && res.status === 'OK') {
            setDirections(res);
            // Extract steps from the first route/leg
            const route = res.routes[0];
            const leg = route.legs[0];
            setSteps(leg.steps);
        }
    }, []);

    // Apply the gesture handling fix when component mounts
    useEffect(() => {
        // Wait for maps to load first
        const timeoutId = setTimeout(() => {
            const cleanup = applyGestureHandlingFix();
            return () => cleanup(); // Clean up when component unmounts
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, []);

    return (
        <div className="App" style={{ width: '100vw', height: '100vh', position: 'relative' }}>
            <LoadScript
                googleMapsApiKey={apiKey}
                region="ie"
                language="en"
                version="3.52"
                onLoad={() => console.log("Maps API loaded successfully")}
                onError={(error) => console.error("Maps API failed to load:", error)}
            >
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={AEROPORTO_METRO}
                    zoom={12}
                    gestureHandling="greedy"
                    options={{
                        fullscreenControl: true,
                        zoomControl: true,
                        scrollwheel: true,
                        disableDoubleClickZoom: false,
                        gestureHandling: 'greedy',
                    }}
                >
                    <Marker
                        position={AEROPORTO_METRO}
                        label="Airport"
                        onClick={() => setActiveMarker('aeroporto')}
                    />
                    {activeMarker === 'aeroporto' && (
                        <InfoWindow
                            position={AEROPORTO_METRO}
                            onCloseClick={() => setActiveMarker(null)}
                        >
                            <div>
                                <div style={{
                                    fontWeight: 'bold',
                                    fontSize: '1.1em',
                                    marginBottom: 4,
                                    lineHeight: 1.2
                                }}>
                                    Airport Arrivals
                                </div>
                                4470-523 Moreira, Portugal
                            </div>
                        </InfoWindow>
                    )}

                    <Marker
                        position={FORMOSA}
                        label="Airbnb"
                        onClick={() => setActiveMarker('airbnb')}
                    />
                    {activeMarker === 'airbnb' && (
                        <InfoWindow
                            position={FORMOSA}
                            onCloseClick={() => setActiveMarker(null)}
                        >
                            <div>
                                <div style={{
                                    fontWeight: 'bold',
                                    fontSize: '1.1em',
                                    marginBottom: 4,
                                    lineHeight: 1.2
                                }}>
                                    Airbnb
                                </div>
                                R. Formosa 414 1, 4000-249 Porto, Portugal
                            </div>
                        </InfoWindow>
                    )}

                    {!directions && (
                        <DirectionsService
                            options={{
                                destination: FORMOSA,
                                origin: AEROPORTO_METRO,
                                travelMode: 'TRANSIT'
                            }}
                            callback={directionsCallback}
                        />
                    )}
                    {directions && (
                        <DirectionsRenderer
                            directions={directions}
                            options={{ suppressMarkers: true }}
                        />
                    )}
                </GoogleMap>
            </LoadScript>
            {/* Show Directions Button */}
            {steps.length > 0 && !showDirections && (
                <button
                    style={{
                        position: 'absolute',
                        top: 80,
                        left: 30,
                        zIndex: 1100,
                        padding: '0.5em 1em',
                        fontSize: '1em',
                        borderRadius: 6,
                        border: 'none',
                        background: '#1976d2',
                        color: 'white',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    }}
                    onClick={() => setShowDirections(true)}
                >
                    Show Directions
                </button>
            )}
            {/* Transit Directions Sidebar */}
            {steps.length > 0 && showDirections && (
                <div style={{
                    position: 'absolute',
                    top: 70,
                    left: 50,
                    background: 'rgba(255,255,255,0.97)',
                    padding: '1em',
                    maxWidth: 355,
                    maxHeight: '70vh',
                    overflowY: 'auto',
                    borderRadius: 8,
                    zIndex: 1200,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}>
                    <button
                        style={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            background: 'transparent',
                            border: 'none',
                            fontSize: '1.2em',
                            cursor: 'pointer',
                            color: '#888'
                        }}
                        onClick={() => setShowDirections(false)}
                        aria-label="Close"
                        title="Close"
                    >
                        ×
                    </button>
                    <h3 style={{ marginTop: 0 }}>Transit Directions</h3>
                    <ol>
                        {steps.map((step, idx) => (
                            <li key={idx} style={{ marginBottom: '1em' }}>
                                <div dangerouslySetInnerHTML={{ __html: step.instructions }} />
                                {step.transit && (
                                    <div>
                                        <strong>Line:</strong> {step.transit.line.short_name} ({step.transit.line.name})<br />
                                        <strong>Vehicle:</strong> {step.transit.line.vehicle.name}
                                    </div>
                                )}
                                <div><em>{step.duration.text}</em></div>
                            </li>
                        ))}
                    </ol>
                    <a
                        href="https://www.google.ie/maps/dir/?api=1&origin=41.236925,-8.670570&destination=41.14916943789735,-8.609004400792529&travelmode=transit"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'inline-block',
                            margin: '0.25em 0 0 0',
                            padding: '0.5em 1em',
                            background: '#1976d2',
                            color: 'white',
                            borderRadius: 6,
                            textDecoration: 'none',
                            fontWeight: 'bold'
                        }}
                    >
                        Open in Google Maps
                    </a>
                </div>
            )}
            <FloatingMenu />
        </div>
    );
}

export default MainMap; 