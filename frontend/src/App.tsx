import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Gallery from './pages/Gallery'
import Upload from './pages/Upload'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b p-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              WorldScars
            </Link>
            <div className="space-x-6">
              <Link to="/" className="text-gray-600 hover:text-blue-600">Home</Link>
              <Link to="/gallery" className="text-gray-600 hover:text-blue-600">Gallery</Link>
              <Link to="/upload" className="text-gray-600 hover:text-blue-600">Upload</Link>
            </div>
          </div>
        </nav>


        <main className="max-w-6xl mx-auto p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/upload" element={<Upload />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
