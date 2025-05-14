import React, { useState, useEffect, useRef } from 'react';

/**
 * MapWrapper component
 * Adds a touch-focused wrapper around maps to improve mobile usability
 */
const MapWrapper = ({ children }) => {
    const wrapperRef = useRef(null);
    const [mapActivated, setMapActivated] = useState(false);

    // Toggle map activation on touch
    const handleTouch = () => {
        if (!mapActivated) {
            setMapActivated(true);
        }
    };

    // Allow a way to deactivate map interaction
    const deactivateMap = (e) => {
        e.stopPropagation();
        setMapActivated(false);
    };

    // Add and remove event listeners
    useEffect(() => {
        const wrapper = wrapperRef.current;

        // Detect if we're on a touch device
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        if (isTouchDevice && wrapper) {
            wrapper.addEventListener('touchstart', handleTouch, { passive: true });
            return () => {
                wrapper.removeEventListener('touchstart', handleTouch);
            };
        }
    }, []);

    return (
        <div
            ref={wrapperRef}
            style={{
                position: 'relative',
                width: '100vw',
                height: '100vh',
                touchAction: mapActivated ? 'none' : 'pan-y',
            }}
        >
            <div style={{
                width: '100%',
                height: '100%',
                pointerEvents: mapActivated ? 'auto' : 'none'
            }}>
                {children}
            </div>

            {!mapActivated && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.03)',
                    zIndex: 10,
                    touchAction: 'manipulation',
                }}>
                    <div style={{
                        padding: '12px 20px',
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        fontSize: '14px',
                        fontWeight: 'bold'
                    }}>
                        Tap to activate map
                    </div>
                </div>
            )}

            {mapActivated && (
                <button
                    onClick={deactivateMap}
                    style={{
                        position: 'absolute',
                        zIndex: 999,
                        bottom: 20,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        padding: '10px 16px',
                        backgroundColor: 'white',
                        borderRadius: '30px',
                        border: 'none',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    Return to scrolling
                </button>
            )}
        </div>
    );
};

export default MapWrapper; 