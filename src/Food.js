import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUtensils, faWineGlass, faCoffee, faBeer, faHouse, faList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import food from './food.json';
import FloatingMenu from './FloatingMenu';
import './MapStyles.css';
import { applyGestureHandlingFix } from './GoogleMapsController';

// Add icons to library
library.add(faUtensils, faWineGlass, faCoffee, faBeer, faHouse, faList);

const PORTO_CENTER = { lat: 41.146, lng: -8.612 };
const AIRBNB_LOCATION = { lat: 41.14916943789735, lng: -8.609004400792529 }; // R. Formosa 414 1, 4000-249 Porto

// Define map container style directly
const mapContainerStyle = {
    width: '100%',
    height: '100%',
};

const ICONS = {
    restaurant: {
        icon: faUtensils,
        color: '#388e3c', // Green
        scale: 0.8
    },
    bar: {
        icon: faWineGlass,
        color: '#1976d2', // Blue
        scale: 0.7
    },
    café: {
        icon: faCoffee,
        color: '#795548', // Brown
        scale: 0.7
    },
    airbnb: {
        icon: faHouse,
        color: '#e91e63', // Pink
        scale: 0.7
    }
};

function getVenueIcon(venue) {
    const venueType = venue.toLowerCase();
    if (venueType.includes('bar')) return ICONS.bar;
    if (venueType.includes('café')) return ICONS.café;
    return ICONS.restaurant;
}

function Food() {
    const [activePlace, setActivePlace] = useState(null);
    const [showAirbnb, setShowAirbnb] = useState(false);
    const [map, setMap] = useState(null);
    const [showListModal, setShowListModal] = useState(false);
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    const onLoad = useCallback((map) => {
        setMap(map);
    }, []);

    const createMarkerIcon = (iconData) => {
        if (!map) return null;

        return {
            url: `data:image/svg+xml;utf-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><path fill='${encodeURIComponent(iconData.color)}' d='${iconData.icon.icon[4]}'/></svg>`,
            scaledSize: new window.google.maps.Size(30, 30),
            anchor: new window.google.maps.Point(15, 15),
            scale: iconData.scale
        };
    };

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
                    onLoad={onLoad}
                    gestureHandling="greedy"
                    options={{
                        fullscreenControl: true,
                        zoomControl: true,
                        scrollwheel: true,
                        disableDoubleClickZoom: false,
                        gestureHandling: 'greedy',
                    }}
                >
                    {map && (
                        <>
                            {/* Airbnb Marker */}
                            <Marker
                                position={AIRBNB_LOCATION}
                                onClick={() => setShowAirbnb(true)}
                                icon={createMarkerIcon(ICONS.airbnb)}
                            />

                            {food.map((place, idx) => {
                                const iconData = getVenueIcon(place.Venue);
                                const icon = createMarkerIcon(iconData);

                                return icon ? (
                                    <Marker
                                        key={idx}
                                        position={{ lat: place.Latitude, lng: place.Longitude }}
                                        onClick={() => setActivePlace(idx)}
                                        icon={icon}
                                    />
                                ) : null;
                            })}
                        </>
                    )}

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

                    {activePlace !== null && (
                        <InfoWindow
                            position={{
                                lat: food[activePlace].Latitude,
                                lng: food[activePlace].Longitude
                            }}
                            onCloseClick={() => setActivePlace(null)}
                        >
                            <div style={{ maxWidth: 250 }}>
                                <div style={{ fontWeight: 'bold', fontSize: '1.1em', marginBottom: 4 }}>
                                    {food[activePlace].Place}
                                </div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    marginBottom: 8,
                                    fontSize: '0.9em',
                                    color: '#666'
                                }}>
                                    <span>{food[activePlace].Venue}</span>
                                    {food[activePlace].Price && (
                                        <span style={{
                                            background: '#f5f5f5',
                                            padding: '2px 6px',
                                            borderRadius: 4,
                                            fontWeight: 'bold'
                                        }}>
                                            {food[activePlace].Price}
                                        </span>
                                    )}
                                </div>
                                {food[activePlace].Address && (
                                    <div style={{ marginBottom: 8, fontSize: '0.9em' }}>
                                        {food[activePlace].Address}
                                    </div>
                                )}
                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 8,
                                    marginBottom: 12
                                }}>
                                    {food[activePlace].Tags && (
                                        <span style={{
                                            background: '#e3f2fd',
                                            padding: '4px 8px',
                                            borderRadius: 12,
                                            fontSize: '0.85em'
                                        }}>
                                            {food[activePlace].Tags}
                                        </span>
                                    )}
                                    {food[activePlace].Specialty && (
                                        <span style={{
                                            background: '#e8f5e9',
                                            padding: '4px 8px',
                                            borderRadius: 12,
                                            fontSize: '0.85em'
                                        }}>
                                            {food[activePlace].Specialty}
                                        </span>
                                    )}
                                </div>
                                <a
                                    href={`https://www.google.ie/maps/search/?api=1&query=${encodeURIComponent(
                                        food[activePlace].Place + ' ' + (food[activePlace].Address || '')
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

            {/* Restaurant List Button */}
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
                    background: '#388e3c',
                    color: 'white',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}
                onClick={() => setShowListModal(true)}
            >
                <FontAwesomeIcon icon={faList} /> Restaurant List
            </button>

            {/* Restaurant List Modal */}
            {showListModal && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
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
                    }}>
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
                            onClick={() => setShowListModal(false)}
                            aria-label="Close"
                            title="Close"
                        >
                            ×
                        </button>
                        <h2 style={{ marginTop: 0, marginBottom: '1em' }}>Porto Restaurants & Bars</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {food.map((place, idx) => {
                                const iconData = getVenueIcon(place.Venue);

                                return (
                                    <div
                                        key={idx}
                                        style={{
                                            padding: '12px',
                                            borderRadius: '8px',
                                            border: '1px solid #eee',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            backgroundColor: '#f9f9f9',
                                            ':hover': { backgroundColor: '#f0f0f0' }
                                        }}
                                        onClick={() => {
                                            setActivePlace(idx);
                                            setShowListModal(false);
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
                                                    <span>{place.Venue}</span>
                                                    {place.Price && (
                                                        <span style={{
                                                            background: '#f5f5f5',
                                                            padding: '2px 6px',
                                                            borderRadius: '4px',
                                                            fontWeight: 'bold'
                                                        }}>
                                                            {place.Price}
                                                        </span>
                                                    )}
                                                    {place.Specialty && (
                                                        <span style={{
                                                            background: '#e8f5e9',
                                                            padding: '2px 6px',
                                                            borderRadius: '4px',
                                                            fontSize: '0.9em'
                                                        }}>
                                                            {place.Specialty}
                                                        </span>
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

export default Food; 