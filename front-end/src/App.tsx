import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react"; //change 1: lazy loading (aka dynamic loading)
//before: it was static imports so loaded immediately
import "./App.css";
import { Layout } from "./Layout/Layout";
import { Loading } from "./Components/Loading/Loading";
import { useTranslation } from 'react-i18next';

//now: dynamic imports with react.lazy
// Lazy load pages to reduce initial bundle size
const Home = lazy(() => import("./Pages/Home/Home").then(module => ({ default: module.Home })));
const Upload = lazy(() => import("./Pages/Upload/Upload").then(module => ({ default: module.Upload })));
const NotFound = lazy(() => import("./Pages/NotFound/NotFound").then(module => ({ default: module.NotFound })));

//Establishes URL paths to specific pages
// the <Route path="/" element=<Layout/>}> tag wraps all other paths
// we do this to make sure the layout(header, footer, navbar) is always on screen
//benefits: Pages now load as separate chunks only when needed, reducing initial bundle size.
function App() {
  const { t } = useTranslation();
  
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={
            <Suspense fallback={<Loading message={t('loading.page') as string} />}>
              <Home />
            </Suspense>
          } />
          <Route path="upload" element={
            <Suspense fallback={<Loading message={t('loading.page') as string} />}>
              <Upload />
            </Suspense>
          } />
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
