import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCartShopping, faPrescriptionBottleMedical, faWineBottle, faHouse, faList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import essentials from './essentials.json';
import FloatingMenu from './FloatingMenu';
import './MapStyles.css';
import { applyGestureHandlingFix } from './GoogleMapsController';

// Add icons to library
library.add(faCartShopping, faPrescriptionBottleMedical, faWineBottle, faHouse, faList);

// Center coordinates - averaged from the essentials data to focus on that area
const ESSENTIALS_CENTER = { lat: 41.149525, lng: -8.605725 };
const AIRBNB_LOCATION = { lat: 41.14916943789735, lng: -8.609004400792529 }; // R. Formosa 414 1, 4000-249 Porto

// Define map container style directly
const mapContainerStyle = {
    width: '100%',
    height: '100%',
};

const ICONS = {
    supermarket: {
        icon: faCartShopping,
        color: '#388e3c', // Green
        scale: 0.8
    },
    pharmacy: {
        icon: faPrescriptionBottleMedical,
        color: '#d32f2f', // Red
        scale: 0.7
    },
    'off-license': {
        icon: faWineBottle,
        color: '#7b1fa2', // Purple
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
    if (venueType.includes('supermarket')) return ICONS.supermarket;
    if (venueType.includes('pharmacy')) return ICONS.pharmacy;
    if (venueType.includes('off-license')) return ICONS['off-license'];
    // Default to supermarket if unknown
    return ICONS.supermarket;
}

function Essentials() {
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
                    center={ESSENTIALS_CENTER}
                    zoom={16}
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

                            {essentials.map((place, idx) => {
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
                                lat: essentials[activePlace].Latitude,
                                lng: essentials[activePlace].Longitude
                            }}
                            onCloseClick={() => setActivePlace(null)}
                        >
                            <div style={{ maxWidth: 250 }}>
                                <div style={{ fontWeight: 'bold', fontSize: '1.1em', marginBottom: 4 }}>
                                    {essentials[activePlace].Place}
                                </div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    marginBottom: 8,
                                    fontSize: '0.9em',
                                    color: '#666'
                                }}>
                                    <span>{essentials[activePlace].Venue}</span>
                                    {essentials[activePlace].Price && (
                                        <span style={{
                                            background: '#f5f5f5',
                                            padding: '2px 6px',
                                            borderRadius: 4,
                                            fontWeight: 'bold'
                                        }}>
                                            {essentials[activePlace].Price}
                                        </span>
                                    )}
                                </div>
                                {essentials[activePlace].Address && (
                                    <div style={{ marginBottom: 8, fontSize: '0.9em' }}>
                                        {essentials[activePlace].Address}
                                    </div>
                                )}
                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 8,
                                    marginBottom: 12
                                }}>
                                    {essentials[activePlace].Tags && (
                                        <span style={{
                                            background: '#e3f2fd',
                                            padding: '4px 8px',
                                            borderRadius: 12,
                                            fontSize: '0.85em'
                                        }}>
                                            {essentials[activePlace].Tags}
                                        </span>
                                    )}
                                </div>
                                <a
                                    href={`https://www.google.ie/maps/search/?api=1&query=${encodeURIComponent(
                                        essentials[activePlace].Place + ' ' + (essentials[activePlace].Address || '')
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

            {/* List Button */}
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
                <FontAwesomeIcon icon={faList} /> Essentials List
            </button>

            {/* List Modal */}
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
                        <h2 style={{ marginTop: 0, marginBottom: '1em' }}>Nearby Essentials</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {essentials.map((place, idx) => {
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

export default Essentials; 