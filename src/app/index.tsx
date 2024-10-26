import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './components/App';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('react-page');
    if (!container) {
        console.error('Failed to find root element');
        return;
    }

    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );

    // Debug message
    console.log('React app mounted');
});

// Debug message
console.log('index.tsx loaded');