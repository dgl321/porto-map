import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faMonument, faLandmark, faBagShopping, faUtensils, faWineGlass, faLocationPin, faMusic, faHouse, faList, faFilter, faMapPin, faUmbrellaBeach } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import places from './places.json';
import FloatingMenu from './FloatingMenu';
import './MapStyles.css';
import { applyGestureHandlingFix } from './GoogleMapsController';

// Add icons to library
library.add(faMonument, faLandmark, faBagShopping, faUtensils, faWineGlass, faLocationPin, faMusic, faHouse, faList, faFilter, faMapPin, faUmbrellaBeach);

const PORTO_CENTER = { lat: 41.145, lng: -8.612 };
const AIRBNB_LOCATION = { lat: 41.14916943789735, lng: -8.609004400792529 }; // R. Formosa 414 1, 4000-249 Porto

// Define map container style directly
const mapContainerStyle = {
    width: '100%',
    height: '100%',
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
    area: {
        icon: faMapPin,
        color: '#00796b' // Teal
    },
    beach: {
        icon: faUmbrellaBeach,
        color: '#039be5' // Light Blue
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
    if (name.includes('praia') || name.includes('beach') || name.includes('pérgola')) return 'beach';
    if (name.includes('douro valley') || name.includes('gaia') || name.includes('foz') || name.includes('ribeira')) return 'area';
    return 'default';
}

function Places() {
    const [activePlace, setActivePlace] = useState(null);
    const [showAirbnb, setShowAirbnb] = useState(false);
    const [showLegend, setShowLegend] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [map, setMap] = useState(null);
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    // Get all unique categories
    const categories = ['All', ...Object.keys(ICONS).filter(cat => cat !== 'default')];

    // Filter places based on selected category
    const filteredPlaces = selectedCategory === 'All'
        ? [...places].sort((a, b) => a.Place.localeCompare(b.Place))
        : [...places].filter(place => getCategory(place) === selectedCategory)
            .sort((a, b) => a.Place.localeCompare(b.Place));

    const onLoad = useCallback((map) => {
        setMap(map);
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
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
            <LoadScript
                googleMapsApiKey={apiKey}
                region="ie"
                language="en"
                version="weekly"
                onLoad={() => console.log("Maps API loaded successfully")}
            >
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={PORTO_CENTER}
                    zoom={14}
                    gestureHandling="greedy"
                    onLoad={onLoad}
                    options={{
                        fullscreenControl: true,
                        zoomControl: true,
                        scrollwheel: true,
                        disableDoubleClickZoom: false,
                        gestureHandling: 'greedy',
                    }}
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

                    {(selectedCategory === 'All' ? places : filteredPlaces).map((place, idx) => {
                        const category = getCategory(place);
                        return (
                            <Marker
                                key={idx}
                                position={{ lat: place.Latitude, lng: place.Longitude }}
                                onClick={() => setActivePlace(idx)}
                                icon={{
                                    path: ICONS[category].icon.icon[4],
                                    fillColor: ICONS[category].color,
                                    fillOpacity: 1,
                                    strokeWeight: 1,
                                    strokeColor: '#ffffff',
                                    scale: 0.05,
                                    anchor: { x: 1.5, y: 1.5 },
                                    scaledSize: { width: 30, height: 30 }
                                }}
                            />
                        );
                    })}
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
                                {places[activePlace].Tags && (
                                    <div style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: 4,
                                        marginBottom: 8
                                    }}>
                                        {Array.isArray(places[activePlace].Tags)
                                            ? places[activePlace].Tags.map((tag, i) => (
                                                <span key={i} style={{
                                                    background: '#e3f2fd',
                                                    padding: '4px 8px',
                                                    borderRadius: 12,
                                                    fontSize: '0.85em'
                                                }}>
                                                    {tag}
                                                </span>
                                            ))
                                            : <span style={{
                                                background: '#e3f2fd',
                                                padding: '4px 8px',
                                                borderRadius: 12,
                                                fontSize: '0.85em'
                                            }}>
                                                {places[activePlace].Tags}
                                            </span>
                                        }
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
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}
                onClick={() => setShowLegend(true)}
            >
                <FontAwesomeIcon icon={faList} /> Places List
            </button>
            {/* Legend Modal */}
            {showLegend && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                    onClick={() => setShowLegend(false)}
                >
                    <div style={{
                        background: 'white',
                        borderRadius: 10,
                        padding: '1.5em',
                        maxWidth: '90%',
                        width: '500px',
                        maxHeight: '80vh',
                        overflowY: 'auto',
                        position: 'relative',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.18)'
                    }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            style={{
                                position: 'absolute',
                                top: 16,
                                right: 16,
                                background: 'transparent',
                                border: 'none',
                                fontSize: '1.5em',
                                cursor: 'pointer',
                                color: '#888',
                                padding: 0,
                                lineHeight: 1
                            }}
                            onClick={() => setShowLegend(false)}
                            aria-label="Close"
                            title="Close"
                        >
                            ×
                        </button>
                        <h2 style={{ marginTop: 0, marginBottom: '1em' }}>Porto Places of Interest</h2>

                        {/* Category Filter */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            marginBottom: '16px'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginBottom: '8px',
                                gap: '8px',
                                color: '#555'
                            }}>
                                <FontAwesomeIcon icon={faFilter} />
                                <span>Filter by category:</span>
                            </div>
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '8px'
                            }}>
                                {categories.map(category => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        style={{
                                            padding: '4px 10px',
                                            borderRadius: '16px',
                                            border: 'none',
                                            background: selectedCategory === category ? '#1976d2' : '#e0e0e0',
                                            color: selectedCategory === category ? 'white' : '#555',
                                            cursor: 'pointer',
                                            fontSize: '0.9em',
                                            fontWeight: selectedCategory === category ? 'bold' : 'normal',
                                            transition: 'all 0.2s ease',
                                            textTransform: 'capitalize'
                                        }}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Places List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {filteredPlaces.map((place, idx) => {
                                const category = getCategory(place);
                                const iconData = ICONS[category];

                                return (
                                    <div
                                        key={idx}
                                        style={{
                                            padding: '12px',
                                            borderRadius: '8px',
                                            border: '1px solid #eee',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            backgroundColor: '#f9f9f9'
                                        }}
                                        onClick={() => {
                                            setActivePlace(places.findIndex(p =>
                                                p.Latitude === place.Latitude &&
                                                p.Longitude === place.Longitude
                                            ));
                                            setShowLegend(false);
                                            if (map) {
                                                map.panTo({ lat: place.Latitude, lng: place.Longitude });
                                                map.setZoom(16);
                                            }
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <FontAwesomeIcon
                                                icon={iconData.icon}
                                                style={{
                                                    color: iconData.color,
                                                    fontSize: '24px',
                                                    minWidth: '24px'
                                                }}
                                            />
                                            <div>
                                                <div style={{ fontWeight: 'bold', fontSize: '1.1em' }}>
                                                    {place.Place}
                                                </div>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    marginTop: '4px',
                                                    fontSize: '0.9em',
                                                    color: '#666'
                                                }}>
                                                    <span style={{
                                                        background: '#e8f5e9',
                                                        padding: '2px 6px',
                                                        borderRadius: '4px',
                                                        textTransform: 'capitalize'
                                                    }}>
                                                        {category}
                                                    </span>
                                                    {place.Address && (
                                                        <span style={{ fontSize: '0.9em', color: '#777' }}>
                                                            {place.Address.substring(0, 30)}
                                                            {place.Address.length > 30 ? '...' : ''}
                                                        </span>
                                                    )}
                                                    {place.Tags && (
                                                        <div style={{
                                                            display: 'flex',
                                                            flexWrap: 'wrap',
                                                            gap: 4,
                                                            marginTop: 4
                                                        }}>
                                                            {Array.isArray(place.Tags)
                                                                ? place.Tags.map((tag, i) => (
                                                                    <span key={i} style={{
                                                                        background: '#e3f2fd',
                                                                        padding: '2px 6px',
                                                                        borderRadius: 8,
                                                                        fontSize: '0.8em'
                                                                    }}>
                                                                        {tag}
                                                                    </span>
                                                                ))
                                                                : null
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
            <FloatingMenu />
        </div>
    );
}

export default Places; 