import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Gallery from './pages/Gallery'
import Upload from './pages/Upload'
import ImageDetail from './pages/ImageDetail'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/image/:id" element={<ImageDetail />} />
      </Routes>
    </Router>
  )
}

export default App
