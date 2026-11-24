import { BrowserRouter, Navigate, Route, Routes, useParams } from "react-router-dom";
import Home from "./pages/Home";
import Archive from "./pages/Archive";
import Dossier from "./pages/Dossier";
import FileExhibit from "./pages/FileExhibit";
import NotFound from "./pages/NotFound";

/** Old /image/:id links keep working. */
function LegacyImageRedirect() {
  const { id } = useParams();
  return <Navigate to={`/exhibit/${id}`} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/exhibit/:id" element={<Dossier />} />
        <Route path="/file" element={<FileExhibit />} />

        {/* legacy routes */}
        <Route path="/gallery" element={<Navigate to="/archive" replace />} />
        <Route path="/upload" element={<Navigate to="/file" replace />} />
        <Route path="/image/:id" element={<LegacyImageRedirect />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
