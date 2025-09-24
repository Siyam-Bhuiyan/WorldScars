import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface Image {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  location: string;
  uploadedAt: string;
}

const Gallery = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/images');
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 via-gray-50 to-stone-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-800"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-stone-50 via-gray-50 to-stone-100">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-20 bg-stone-50/90 backdrop-blur-lg border-b border-stone-200/30">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-18">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="text-stone-600">
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"></path>
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-stone-800">WorldScars</h2>
            </div>
            <nav className="hidden md:flex items-center gap-6 lg:gap-10">
              <button 
                onClick={() => navigate('/gallery')}
                className="text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-800 transition-colors"
              >
                Explore
              </button>
              <a className="text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-800 transition-colors" href="#">Collections</a>
              <a className="text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-800 transition-colors" href="#">About</a>
            </nav>
            <div className="flex items-center gap-1 sm:gap-2">
              <button className="rounded-full p-1.5 sm:p-2 text-stone-600 hover:text-stone-800 hover:bg-stone-200/50 transition-colors">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
                </svg>
              </button>
              <button className="rounded-full p-1.5 sm:p-2 text-stone-600 hover:text-stone-800 hover:bg-stone-200/50 transition-colors">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              </button>
              {/* Mobile menu button */}
              <button className="md:hidden rounded-full p-1.5 sm:p-2 text-stone-600 hover:text-stone-800 hover:bg-stone-200/50 transition-colors">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-6 py-8 pt-24 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="mb-20 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-stone-800 sm:text-6xl lg:text-7xl mb-8">
            Historical Images
          </h1>
          <p className="max-w-4xl mx-auto text-xl text-stone-600 leading-relaxed">
            Discover powerful moments that shaped our world through this curated collection of historical photographs and artworks.
          </p>
        </div>

        {images.length === 0 ? (
          <div className="text-center py-24">
            <div className="mb-8">
              <div className="w-36 h-36 mx-auto bg-stone-100 rounded-3xl flex items-center justify-center mb-8 shadow-inner">
                <svg className="w-18 h-18 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-stone-700 mb-4">No images yet</h3>
              <p className="text-xl text-stone-500 mb-10 max-w-lg mx-auto">Start building your collection of powerful historical moments and artworks</p>
              <button
                onClick={() => navigate('/upload')}
                className="px-10 py-5 bg-stone-800 hover:bg-stone-700 text-stone-50 text-lg font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                Upload First Image
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
            {images.map((image) => (
              <Link
                key={image.id}
                to={`/image/${image.id}`}
                className="group cursor-pointer"
              >
                <div className="group relative overflow-hidden rounded-3xl bg-stone-50 shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 border border-stone-200/60 hover:border-stone-300/80">
                  {/* Square Image Container */}
                  <div className="aspect-square overflow-hidden bg-stone-100">
                    <img 
                      alt={image.title} 
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
                      src={image.imageUrl}
                      loading="lazy"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  
                  {/* Card Content */}
                  <div className="p-8">
                    <h3 className="text-xl font-bold text-stone-800 mb-3 line-clamp-2 group-hover:text-stone-600 transition-colors leading-tight">
                      {image.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Gallery;