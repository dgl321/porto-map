import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function FloatingMenu() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div>
            {/* Floating Button */}
            <button
                style={{
                    position: 'fixed',
                    bottom: 24,
                    left: 24,
                    zIndex: 2000,
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: '#1976d2',
                    color: 'white',
                    border: 'none',
                    fontSize: '2em',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
                    cursor: 'pointer'
                }}
                onClick={() => setOpen(!open)}
                aria-label="Open navigation"
                title="Open navigation"
            >
                ☰
            </button>
            {/* Modal/Popover */}
            {open && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: 90,
                        left: 24,
                        background: 'white',
                        borderRadius: 10,
                        boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
                        padding: '1em 1.5em',
                        zIndex: 2100,
                        minWidth: 180
                    }}
                >
                    <button
                        style={{
                            position: 'absolute',
                            top: 8,
                            right: 12,
                            background: 'transparent',
                            border: 'none',
                            fontSize: '1.2em',
                            cursor: 'pointer',
                            color: '#888'
                        }}
                        onClick={() => setOpen(false)}
                        aria-label="Close"
                        title="Close"
                    >
                        ×
                    </button>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
                        <button
                            style={{
                                background: '#1976d2',
                                color: 'white',
                                border: 'none',
                                borderRadius: 6,
                                padding: '0.5em 1em',
                                fontSize: '1em',
                                cursor: 'pointer'
                            }}
                            onClick={() => { navigate('/'); setOpen(false); }}
                        >
                            Airport Transport
                        </button>
                        <button
                            style={{
                                background: '#1976d2',
                                color: 'white',
                                border: 'none',
                                borderRadius: 6,
                                padding: '0.5em 1em',
                                fontSize: '1em',
                                cursor: 'pointer'
                            }}
                            onClick={() => { navigate('/places'); setOpen(false); }}
                        >
                            Things to do
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FloatingMenu; 