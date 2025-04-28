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
                    width: '64px',
                    height: '64px',
                    minWidth: '64px',
                    minHeight: '64px',
                    borderRadius: '50%',
                    background: '#1976d2',
                    color: 'white',
                    border: 'none',
                    fontSize: '2.5em',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0,
                    lineHeight: 1,
                    aspectRatio: '1/1'
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
                        bottom: 100,
                        left: 24,
                        background: 'white',
                        borderRadius: 12,
                        boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
                        padding: '1.2em 1.8em',
                        zIndex: 2100,
                        minWidth: 200,
                        maxWidth: 'calc(100vw - 48px)'
                    }}
                >
                    <button
                        style={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            background: 'transparent',
                            border: 'none',
                            fontSize: '1.5em',
                            cursor: 'pointer',
                            color: '#888',
                            padding: 0,
                            lineHeight: 1
                        }}
                        onClick={() => setOpen(false)}
                        aria-label="Close"
                        title="Close"
                    >
                        ×
                    </button>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
                        <button
                            style={{
                                background: '#1976d2',
                                color: 'white',
                                border: 'none',
                                borderRadius: 8,
                                padding: '0.8em 1.2em',
                                fontSize: '1.1em',
                                cursor: 'pointer',
                                textAlign: 'left',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
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
                                borderRadius: 8,
                                padding: '0.8em 1.2em',
                                fontSize: '1.1em',
                                cursor: 'pointer',
                                textAlign: 'left',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}
                            onClick={() => { navigate('/places'); setOpen(false); }}
                        >
                            Things to do
                        </button>
                        <button
                            style={{
                                background: '#1976d2',
                                color: 'white',
                                border: 'none',
                                borderRadius: 8,
                                padding: '0.8em 1.2em',
                                fontSize: '1.1em',
                                cursor: 'pointer',
                                textAlign: 'left',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}
                            onClick={() => { navigate('/food'); setOpen(false); }}
                        >
                            Food & Drink
                        </button>
                        <a
                            href="https://www.notion.so/dgl1/Porto-Trip-1dcc85b4b4ed8053adccfdd1ed9288b3?pvs=4"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                background: '#1976d2',
                                color: 'white',
                                border: 'none',
                                borderRadius: 8,
                                padding: '0.8em 1.2em',
                                fontSize: '1.1em',
                                cursor: 'pointer',
                                textAlign: 'left',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                textDecoration: 'none',
                                display: 'block'
                            }}
                            onClick={() => setOpen(false)}
                        >
                            Trip Plan
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FloatingMenu; 