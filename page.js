'use client';

import { useEffect } from 'react';
import HYDR801App from './HYDR801App';

export default function Home() {
  useEffect(() => {
    // Register service worker for PWA functionality
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration.scope);
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
    }

    // Prevent default pull-to-refresh behavior
    document.body.style.overscrollBehavior = 'none';
    
    // Add iOS standalone mode detection
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         window.navigator.standalone;
    if (isStandalone) {
      document.body.classList.add('standalone-mode');
    }
  }, []);

  return <HYDR801App />;
}
