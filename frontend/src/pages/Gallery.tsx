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
      <div className="min-h-screen flex items-center justify-center bg-[#f8f5f2]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1173d4]"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f8f5f2] text-[#333333]">
      {/* Header */}
      <header className="sticky top-0 z-10 w-full border-b border-gray-200/20 bg-[#f8f5f2]/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[#333333]">
              <svg className="text-[#1173d4] text-3xl" fill="currentColor" viewBox="0 0 24 24" width="32" height="32">
                <path d="M12 3L2 9v10c0 5.55 3.84 9 9 9s9-4.03 9-9V9l-8-6z"/>
              </svg>
              <span className="text-xl font-bold">WorldScars</span>
            </button>
            <nav className="hidden md:flex items-center gap-6">
              <button 
                onClick={() => navigate('/')}
                className="text-sm font-medium text-[#757575] hover:text-[#1173d4] transition-colors"
              >
                Home
              </button>
              <a className="text-sm font-medium text-[#757575] hover:text-[#1173d4] transition-colors" href="#">Explore</a>
              <a className="text-sm font-medium text-[#757575] hover:text-[#1173d4] transition-colors" href="#">Exhibitions</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#757575] w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
              </svg>
              <input 
                className="w-full rounded-full border border-gray-300/50 bg-white py-2 pl-10 pr-4 text-sm focus:border-[#1173d4] focus:ring-[#1173d4] focus:outline-none" 
                placeholder="Search artworks..." 
                type="text"
              />
            </div>
            <button className="relative rounded-full p-2 text-[#757575] hover:bg-gray-200/50 hover:text-[#333333] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5h-5v-5z M4 19.5A2.5 2.5 0 0 1 1.5 17v-9A2.5 2.5 0 0 1 4 5.5h16A2.5 2.5 0 0 1 22.5 8v9a2.5 2.5 0 0 1-2.5 2.5H4z" />
              </svg>
            </button>
            <button 
              onClick={() => navigate('/upload')}
              className="size-9 rounded-full bg-cover bg-center bg-[#1173d4] flex items-center justify-center text-white hover:bg-[#1173d4]/90 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[#333333] sm:text-5xl lg:text-6xl">
            Influential Images Gallery
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-[#757575]">
            A curated collection of influential historical moments and artworks throughout history.
          </p>
        </div>

        {images.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto bg-[#333333]/10 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-[#333333]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#333333]/70 mb-2">No images yet</h3>
              <p className="text-[#757575] mb-6">Start building your collection of historical moments</p>
              <button
                onClick={() => navigate('/upload')}
                className="px-8 py-3 bg-[#1173d4] hover:bg-[#1173d4]/90 text-white rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Upload First Image
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {images.map((image) => (
              <Link
                key={image.id}
                to={`/image/${image.id}`}
                className="group cursor-pointer"
              >
                <div className="group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                  <div className="overflow-hidden">
                    <img 
                      alt={image.title} 
                      className="h-auto w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105" 
                      src={image.imageUrl}
                      loading="lazy"
                      style={{ aspectRatio: '3/4' }}
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-[#333333] mb-1 line-clamp-2">
                      {image.title}
                    </h3>
                    {image.location && (
                      <p className="text-sm text-[#757575] mb-2">
                        {image.location}
                      </p>
                    )}
                    {image.description && (
                      <p className="text-sm text-[#757575] line-clamp-3">
                        {image.description}
                      </p>
                    )}
                    <div className="mt-3 text-xs text-[#757575]">
                      {new Date(image.uploadedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200/20 bg-[#f8f5f2] mt-16">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-[#757575]">© 2024 WorldScars. All rights reserved.</p>
            <div className="flex gap-4">
              <a className="text-[#757575] hover:text-[#1173d4] transition-colors" href="#" aria-label="Twitter">
                <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 2.8 3.2 3 5.2-2.7-1.1-5.4-2-8-2.6-2.6-.7-5.3-1-8-1.3-.2 2.6-1 5.1-2.6 7.1-1.3 1.6-3 2.9-4.9 3.9 2.4-.1 4.7-.6 7-1.5 2.3-.9 4.4-2.1 6.3-3.7 1.9-1.6 3.6-3.4 5-5.5z"></path>
                </svg>
              </a>
              <a className="text-[#757575] hover:text-[#1173d4] transition-colors" href="#" aria-label="Instagram">
                <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24">
                  <rect height="20" rx="5" ry="5" width="20" x="2" y="2"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </a>
              <a className="text-[#757575] hover:text-[#1173d4] transition-colors" href="#" aria-label="Facebook">
                <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Gallery;