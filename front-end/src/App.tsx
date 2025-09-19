import { Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react"; //change 1: lazy loading (aka dynamic loading) defer loading the component until it is actually needed
//suspense: lazy components load async so we need to  
//before: it was static imports so loaded immediately
//import { Home } from "./Pages/Home/Home"; //CHANGE ME when we are done with purely NUMIDENT
//import { NotFound } from "./Pages/NotFound/NotFound";
//import { Upload } from "./Pages/Upload/Upload";
import "./App.css";
import { Layout } from "./Layout/Layout";
import { Loading } from "./Components/Loading/Loading";
import { useTranslation } from 'react-i18next';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

//now: dynamic imports with react.lazy
// Lazy load pages to reduce initial bundle size
const Home = lazy(() =>  
  import("./Pages/Home/Home") // <-- dynamic import (code splitting)
    .then(module => ({ default: module.Home }))); // <-- adapt named export into a default export
const Upload = lazy(() => 
  import("./Pages/Upload/Upload")
    .then(module => ({ default: module.Upload })));
const NotFound = lazy(() => 
  import("./Pages/NotFound/NotFound")
    .then(module => ({ default: module.NotFound })));

function App() {
  const { t } = useTranslation(); // ← NEW: Translation hook for internationalization in the front end!
    
  
  
  //offline page
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showOfflineBanner, setShowOfflineBanner] = useState(false);

  useEffect(() => {
    let deferredPrompt: BeforeInstallPromptEvent | null = null;
  
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('[PWA] Install prompt available');
      e.preventDefault();
      deferredPrompt = e as BeforeInstallPromptEvent;
    };
  
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {

    // More robust offline detection
    const checkOnlineStatus = async () => {
      if (!navigator.onLine) {
        setIsOffline(true);
        setShowOfflineBanner(true);
        return;
      }

      // Test actual connectivity by trying to fetch a small resource
      try {
        const response = await fetch('/manifest.json', {
          method: 'HEAD',
          cache: 'no-cache'
        });
        const online = response.ok;
        setIsOffline(!online);
        setShowOfflineBanner(!online);
      } catch {
        setIsOffline(true);
        setShowOfflineBanner(true);
      }
    };

    const handleOnline = () => {
      setIsOffline(false);
      // Keep banner for a moment to confirm reconnection
      setTimeout(() => setShowOfflineBanner(false), 2000);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowOfflineBanner(true);
    };

    // Initial check
    checkOnlineStatus();

    // Listen for network changes
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodic connectivity checks when online
    const interval = setInterval(() => {
      if (navigator.onLine) {
        checkOnlineStatus();
      }
    }, 30000); // Check every 30 seconds

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  
  return (
    <div className="App">
         {showOfflineBanner && (
        <div className={`offline-banner ${!isOffline ? 'reconnected' : ''}`}>
          <p>
            {isOffline 
              ? "You're offline. Some features may not work."
              : "Back online!"
            }
          </p>
      </div>
  )}
      <Routes>
        {/* //lazy loading for home page */}
        <Route path="/" element={<Layout />}> 
        {/* element={<Layout />}: Wrap all the child routes with this Layout component. */}
          <Route index element={
            //  lazy components load asynchronously,
            <Suspense fallback={<Loading message={t('loading.page') as string} />}>
              <Home />
            </Suspense>
          } />
          {/* //lazy loading for upload page */}
          <Route path="upload" element={
            <Suspense fallback={<Loading message={t('loading.page') as string} />}>
              <Upload />
            </Suspense>
          } />
          {/* //lazy loading fo Not found */}
          <Route path="*" element={
            <Suspense fallback={<Loading message={t('loading.page') as string} />}>
              <NotFound />
            </Suspense>
          } />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
