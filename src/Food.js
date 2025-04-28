import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUtensils, faWineGlass, faCoffee, faBeer } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import food from './food.json';
import FloatingMenu from './FloatingMenu';

// Add icons to library
library.add(faUtensils, faWineGlass, faCoffee, faBeer);

const PORTO_CENTER = { lat: 41.1579, lng: -8.6291 };

const containerStyle = {
    width: '100vw',
    height: '100vh',
    margin: 0,
    padding: 0,
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
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    return (
        <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0 }}>
            <LoadScript googleMapsApiKey={apiKey}>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={PORTO_CENTER}
                    zoom={13}
                >
                    {food.map((place, idx) => {
                        const iconData = getVenueIcon(place.Venue);
                        return (
                            <Marker
                                key={idx}
                                position={{ lat: place.Latitude, lng: place.Longitude }}
                                onClick={() => setActivePlace(idx)}
                                icon={{
                                    url: `data:image/svg+xml;utf-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><path fill='${encodeURIComponent(iconData.color)}' d='${iconData.icon.icon[4]}'/></svg>`,
                                    scaledSize: new window.google.maps.Size(30, 30),
                                    anchor: new window.google.maps.Point(15, 15),
                                    scale: iconData.scale
                                }}
                            />
                        );
                    })}
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
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
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
            <FloatingMenu />
        </div>
    );
}

export default Food; 