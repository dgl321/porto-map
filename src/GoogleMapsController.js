/**
 * GoogleMapsController.js
 * Utility to modify Google Maps behavior for better mobile touch handling
 */

// Function to apply gesture handling fixes
export const applyGestureHandlingFix = () => {
    // Create a custom style element
    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.innerHTML = `
    /* Force gesture handling to work correctly */
    .gm-control-active, .gm-style, .gm-style-iw, .gm-bundled-control, .gm-bundled-control-on-bottom {
      touch-action: none !important;
    }
    
    /* Override Google's two finger warning */
    .gm-style > div:first-child > div:nth-child(4) > div:nth-child(4) {
      display: none !important;
    }
    
    /* Hide the "For improved scrolling" tooltip */
    .gm-style > div:first-child > div:last-child > div:last-child {
      display: none !important;
    }
    
    /* Hide "Use two fingers to move the map" message completely */
    .gm-style > div:first-child > div:last-child > div:nth-child(1):not(:empty) {
      display: none !important;
    }
    
    /* Enable smoother touch scrolling */
    .gm-style {
      -webkit-overflow-scrolling: touch;
    }
  `;

    // Append the style to head
    document.head.appendChild(styleElement);

    // Try to find and disable the "Use two fingers" message
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Look for the "Use two fingers" message div
                        const twoFingerMessages = document.querySelectorAll('.gm-style > div > div:last-child > div');
                        twoFingerMessages.forEach(element => {
                            if (element.textContent?.includes('Use two fingers')) {
                                element.style.display = 'none';
                            }
                        });
                    }
                }
            }
        }
    });

    // Start observing the document
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Attempt to override Google Maps touch handler
    const attemptOverride = () => {
        try {
            if (window.google && window.google.maps) {
                // Try to set gestureHandling programmatically
                const mapInstances = document.querySelectorAll('.gm-style');
                mapInstances.forEach(mapElement => {
                    const mapInstance = mapElement.__gm;
                    if (mapInstance && mapInstance.set) {
                        mapInstance.set('gestureHandling', 'greedy');
                    }
                });
            }
        } catch (e) {
            console.log('GoogleMapsController: Error overriding gesture handling', e);
        }
    };

    // Set interval to keep checking and overriding
    const intervalId = setInterval(attemptOverride, 1000);

    // Clear interval after 10 seconds to avoid running indefinitely
    setTimeout(() => clearInterval(intervalId), 10000);

    return () => {
        // Cleanup function
        clearInterval(intervalId);
        observer.disconnect();
        document.head.removeChild(styleElement);
    };
}; 