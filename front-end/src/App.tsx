import { Routes, Route } from "react-router-dom";
import "./App.css";
import { Layout } from "./Layout/Layout";
import { Home } from "./Pages/Home/Home"; //CHANGE ME when we are done with purely NUMIDENT
import { NotFound } from "./Pages/NotFound/NotFound";
import { Upload } from "./Pages/Upload/Upload";

//Establishes URL paths to specific pages
// the <Route path="/" element=<Layout/>}> tag wraps all other paths
// we do this to make sure the layout(header, footer, navbar) is always on screen
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="upload" element={<Upload/>} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
