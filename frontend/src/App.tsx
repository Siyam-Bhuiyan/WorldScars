import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import Home from "./pages/Home";
import Archive from "./pages/Archive";
import Dossier from "./pages/Dossier";
import FileExhibit from "./pages/FileExhibit";
import NotFound from "./pages/NotFound";
import Cursor from "./components/Cursor";
import Curtain from "./components/Curtain";
import Intro from "./components/Intro";
import { scrollToTop, startSmoothScroll } from "./lib/scroll";

/** Old /image/:id links keep working. */
function LegacyImageRedirect() {
  const { id } = useParams();
  return <Navigate to={`/exhibit/${id}`} replace />;
}

function Stage() {
  const { pathname } = useLocation();

  useEffect(() => startSmoothScroll(), []);
  useEffect(() => scrollToTop(), [pathname]);

  return (
    <>
      <Curtain key={pathname} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/exhibit/:id" element={<Dossier />} />
        <Route path="/file" element={<FileExhibit />} />
        <Route path="/witness" element={<Navigate to="/file" replace />} />

        {/* legacy routes */}
        <Route path="/gallery" element={<Navigate to="/archive" replace />} />
        <Route path="/upload" element={<Navigate to="/file" replace />} />
        <Route path="/image/:id" element={<LegacyImageRedirect />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Intro />
      <Cursor />
      <Stage />
    </BrowserRouter>
  );
}
