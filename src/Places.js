import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import places from './places.json';
import FloatingMenu from './FloatingMenu';

const PORTO_CENTER = { lat: 41.1579, lng: -8.6291 };

const containerStyle = {
    width: '100vw',
    height: '100vh',
    margin: 0,
    padding: 0,
};

const ICONS = {
    landmark: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="%23d32f2f" viewBox="0 0 24 24"><path d="M12 2 2 7v2h20V7L12 2zm0 2.18L18.6 7H5.4L12 4.18zM4 10v10h16V10H4zm2 2h2v6H6v-6zm4 0h4v6h-4v-6zm6 0h2v6h-2v-6z"/></svg>',
    museum: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="%237b1fa2" viewBox="0 0 24 24"><path d="M12 2 2 7v2h20V7L12 2zm0 2.18L18.6 7H5.4L12 4.18zM4 10v10h16V10H4zm2 2h2v6H6v-6zm4 0h4v6h-4v-6zm6 0h2v6h-2v-6z"/></svg>',
    shopping: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="32" width="32" viewBox="0 -960 960 960" fill="%234B77D1"><path d="M841-518v318q0 33-23.5 56.5T761-120H201q-33 0-56.5-23.5T121-200v-318q-23-21-35.5-54t-.5-72l42-136q8-26 28.5-43t47.5-17h556q27 0 47 16.5t29 43.5l42 136q12 39-.5 71T841-518Zm-272-42q27 0 41-18.5t11-41.5l-22-140h-78v148q0 21 14 36.5t34 15.5Zm-180 0q23 0 37.5-15.5T441-612v-148h-78l-22 140q-4 24 10.5 42t37.5 18Zm-178 0q18 0 31.5-13t16.5-33l22-154h-78l-40 134q-6 20 6.5 43t41.5 23Zm540 0q29 0 42-23t6-43l-42-134h-76l22 154q3 20 16.5 33t31.5 13ZM201-200h560v-282q-5 2-6.5 2H751q-27 0-47.5-9T663-518q-18 18-41 28t-49 10q-27 0-50.5-10T481-518q-17 18-39.5 28T393-480q-29 0-52.5-10T299-518q-21 21-41.5 29.5T211-480h-4.5q-2.5 0-5.5-2v282Zm560 0H201h560Z"/></svg>',
    music: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="%231976d2" viewBox="0 0 24 24"><path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z"/></svg>',
    food: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="%23388e3c" viewBox="0 0 24 24"><path d="M11 9.16V2h2v7.16c2.39.49 4 2.5 4 4.84 0 2.21-1.79 4-4 4s-4-1.79-4-4c0-2.34 1.61-4.35 4-4.84z"/></svg>',
    default: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="%23ff9800" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>'
};

function getCategory(place) {
    const name = place.Place.toLowerCase();
    if (name.includes('museum') || name.includes('serralves') || name.includes('palácio') || name.includes('world of wine')) return 'museum';
    if (name.includes('shopping') || name.includes('mercado') || name.includes('livraria') || name.includes('claus porto')) return 'shopping';
    if (name.includes('music') || name.includes('fado')) return 'music';
    if (name.includes('food') || name.includes('rota do douro') || name.includes('burmester')) return 'food';
    if (name.includes('church') || name.includes('chapel') || name.includes('tower') || name.includes('funicular') || name.includes('miradouro') || name.includes('serra') || name.includes('são bento') || name.includes('gaia') || name.includes('foz')) return 'landmark';
    return 'default';
}

function Places() {
    const [activePlace, setActivePlace] = useState(null);
    const [showLegend, setShowLegend] = useState(false);
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    return (
        <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0 }}>
            <LoadScript googleMapsApiKey={apiKey}>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={PORTO_CENTER}
                    zoom={13}
                >
                    {places.map((place, idx) => (
                        <Marker
                            key={idx}
                            position={{ lat: place.Latitude, lng: place.Longitude }}
                            onClick={() => setActivePlace(idx)}
                            icon={{
                                url: ICONS[getCategory(place)],
                                scaledSize: { width: 32, height: 32 }
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
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
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
                            {Object.entries(ICONS).map(([cat, iconUrl]) => (
                                <li key={cat} style={{ marginBottom: 12, display: 'flex', alignItems: 'center' }}>
                                    <img src={iconUrl} alt={cat} style={{ width: 24, height: 24, marginRight: 10 }} />
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