import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faMonument, faLandmark, faBagShopping, faUtensils, faWineGlass, faLocationPin, faMusic, faHouse } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import places from './places.json';
import FloatingMenu from './FloatingMenu';

// Add icons to library
library.add(faMonument, faLandmark, faBagShopping, faUtensils, faWineGlass, faLocationPin, faMusic, faHouse);

const PORTO_CENTER = { lat: 41.1579, lng: -8.6291 };
const AIRBNB_LOCATION = { lat: 41.14916943789735, lng: -8.609004400792529 }; // R. Formosa 414 1, 4000-249 Porto

const containerStyle = {
    width: '100vw',
    height: '100vh',
    margin: 0,
    padding: 0,
};

const ICONS = {
    landmark: {
        icon: faMonument,
        color: '#d32f2f' // Red
    },
    museum: {
        icon: faLandmark,
        color: '#7b1fa2' // Purple
    },
    shopping: {
        icon: faBagShopping,
        color: '#4B77D1' // Blue
    },
    food: {
        icon: faUtensils,
        color: '#388e3c' // Green
    },
    drinks: {
        icon: faWineGlass,
        color: '#1976d2' // Blue
    },
    music: {
        icon: faMusic,
        color: '#9c27b0' // Purple
    },
    airbnb: {
        icon: faHouse,
        color: '#e91e63' // Pink
    },
    default: {
        icon: faLocationPin,
        color: '#ff9800' // Orange
    }
};

function getCategory(place) {
    const name = place.Place.toLowerCase();
    if (name.includes('museum') || name.includes('serralves') || name.includes('palácio') || name.includes('world of wine')) return 'museum';
    if (name.includes('shopping') || name.includes('mercado') || name.includes('livraria') || name.includes('claus porto')) return 'shopping';
    if (name.includes('food') || name.includes('rota do douro') || name.includes('food')) return 'food';
    if (name.includes('burmester') || name.includes('Graham') || name.includes('bar')) return 'drinks';
    if (name.includes('clérigos') || name.includes('chapel') || name.includes('são bento') || name.includes('funicular')) return 'landmark';
    if (name.includes('music') || name.includes('fado') || name.includes('dance') || name.includes('show')) return 'music';
    return 'default';
}

function Places() {
    const [activePlace, setActivePlace] = useState(null);
    const [showAirbnb, setShowAirbnb] = useState(false);
    const [showLegend, setShowLegend] = useState(false);
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    return (
        <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0 }}>
            <LoadScript
                googleMapsApiKey={apiKey}
                region="ie"
                language="en"
            >
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={PORTO_CENTER}
                    zoom={13}
                >
                    {/* Airbnb Marker */}
                    <Marker
                        position={AIRBNB_LOCATION}
                        onClick={() => setShowAirbnb(true)}
                        icon={{
                            path: ICONS.airbnb.icon.icon[4],
                            fillColor: ICONS.airbnb.color,
                            fillOpacity: 1,
                            strokeWeight: 1,
                            strokeColor: '#ffffff',
                            scale: 0.05,
                            anchor: { x: 1.5, y: 1.5 },
                            scaledSize: { width: 30, height: 30 }
                        }}
                    />
                    {showAirbnb && (
                        <InfoWindow
                            position={AIRBNB_LOCATION}
                            onCloseClick={() => setShowAirbnb(false)}
                        >
                            <div>
                                <div style={{ fontWeight: 'bold', fontSize: '1.1em', marginBottom: 4 }}>
                                    Airbnb
                                </div>
                                <div style={{ marginBottom: 8 }}>
                                    R. Formosa 414 1, 4000-249 Porto, Portugal
                                </div>
                                <a
                                    href={`https://www.google.ie/maps/search/?api=1&query=${encodeURIComponent(
                                        "R. Formosa 414 1, 4000-249 Porto, Portugal"
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'inline-block',
                                        marginTop: 4,
                                        padding: '0.3em 0.8em',
                                        background: '#1976d2',
                                        color: 'white',
                                        borderRadius: 6,
                                        textDecoration: 'none',
                                        fontWeight: 'bold',
                                        fontSize: '0.95em'
                                    }}
                                >
                                    Open in Google Maps
                                </a>
                            </div>
                        </InfoWindow>
                    )}

                    {places.map((place, idx) => (
                        <Marker
                            key={idx}
                            position={{ lat: place.Latitude, lng: place.Longitude }}
                            onClick={() => setActivePlace(idx)}
                            icon={{
                                path: ICONS[getCategory(place)].icon.icon[4],
                                fillColor: ICONS[getCategory(place)].color,
                                fillOpacity: 1,
                                strokeWeight: 1,
                                strokeColor: '#ffffff',
                                scale: 0.05,
                                anchor: { x: 1.5, y: 1.5 },
                                scaledSize: { width: 30, height: 30 }
                            }}
                        />
                    ))}
                    {activePlace !== null && (
                        <InfoWindow
                            position={{
                                lat: places[activePlace].Latitude,
                                lng: places[activePlace].Longitude
                            }}
                            onCloseClick={() => setActivePlace(null)}
                        >
                            <div>
                                <div style={{ fontWeight: 'bold', fontSize: '1.1em', marginBottom: 4 }}>
                                    {places[activePlace].Place}
                                </div>
                                {places[activePlace].Address && (
                                    <div style={{ marginBottom: 8 }}>
                                        {places[activePlace].Address}
                                    </div>
                                )}
                                <a
                                    href={`https://www.google.ie/maps/search/?api=1&query=${encodeURIComponent(
                                        places[activePlace].Place + ' ' + (places[activePlace].Address || '')
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'inline-block',
                                        marginTop: 4,
                                        padding: '0.3em 0.8em',
                                        background: '#1976d2',
                                        color: 'white',
                                        borderRadius: 6,
                                        textDecoration: 'none',
                                        fontWeight: 'bold',
                                        fontSize: '0.95em'
                                    }}
                                >
                                    Open in Google Maps
                                </a>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </LoadScript>
            {/* Legend Button */}
            <button
                style={{
                    position: 'absolute',
                    top: 80,
                    left: 30,
                    zIndex: 1200,
                    padding: '0.5em 1em',
                    fontSize: '1em',
                    borderRadius: 6,
                    border: 'none',
                    background: '#1976d2',
                    color: 'white',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}
                onClick={() => setShowLegend(true)}
            >
                Legend
            </button>
            {/* Legend Modal */}
            {showLegend && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.3)',
                    zIndex: 1300,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: 10,
                        padding: '1.5em 2em',
                        maxHeight: '80vh',
                        overflowY: 'auto',
                        minWidth: 280,
                        boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
                        position: 'relative'
                    }}>
                        <button
                            style={{
                                position: 'absolute',
                                top: 16,
                                right: 24,
                                background: 'transparent',
                                border: 'none',
                                fontSize: '1.5em',
                                cursor: 'pointer',
                                color: '#888'
                            }}
                            onClick={() => setShowLegend(false)}
                            aria-label="Close"
                            title="Close"
                        >
                            ×
                        </button>
                        <h3 style={{ marginTop: 0 }}>Legend</h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {Object.entries(ICONS).map(([cat, iconData]) => (
                                <li key={cat} style={{ marginBottom: 12, display: 'flex', alignItems: 'center' }}>
                                    <FontAwesomeIcon
                                        icon={iconData.icon}
                                        style={{
                                            color: iconData.color,
                                            fontSize: '24px',
                                            marginRight: '10px'
                                        }}
                                    />
                                    <span style={{ textTransform: 'capitalize' }}>{cat}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
            <FloatingMenu />
        </div>
    );
}

export default Places; 