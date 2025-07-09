import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react"; //change 1: lazy loading (aka dynamic loading) defer loading the component until it is actually needed
//suspense: lazy components load async so we need to  
//before: it was static imports so loaded immediately
//import { Home } from "./Pages/Home/Home"; //CHANGE ME when we are done with purely NUMIDENT
//import { NotFound } from "./Pages/NotFound/NotFound";
//import { Upload } from "./Pages/Upload/Upload";
import "./App.css";
import { Layout } from "./Layout/Layout";
import { Loading } from "./Components/Loading/Loading";
import { useTranslation } from 'react-i18next';

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

//Establishes URL paths to specific pages
// the <Route path="/" element=<Layout/>}> tag wraps all other paths
// we do this to make sure the layout(header, footer, navbar) is always on screen
//benefits: Pages now load as separate chunks only when needed, reducing initial bundle size.
function App() {
  const { t } = useTranslation(); // ← NEW: Translation hook for internationalization in the front end!
  
  return (
    <div className="App">
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
