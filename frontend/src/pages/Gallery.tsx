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
      <div className="min-h-screen flex items-center justify-center bg-[#f6f7f8]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1791cf]"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f6f7f8] text-[#111c21]">
      {/* Header */}
      <header className="sticky top-0 z-10 w-full border-b border-[#1791cf]/20 bg-[#f6f7f8]/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <button onClick={() => navigate('/')} className="flex items-center gap-2">
            <svg className="text-[#1791cf]" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
            <span className="text-xl font-bold">WorldScars</span>
          </button>
          <nav className="hidden items-center gap-6 md:flex">
            <a className="font-medium hover:text-[#1791cf]" href="#">Home</a>
            <a className="font-medium hover:text-[#1791cf]" href="#">Collections</a>
            <a className="font-medium hover:text-[#1791cf]" href="#">About</a>
          </nav>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="text-[#1791cf]/70" fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
                </svg>
              </span>
              <input className="w-full rounded-full border-[#1791cf]/20 bg-[#f6f7f8]/50 py-2 pl-10 pr-4 focus:border-[#1791cf] focus:outline-none focus:ring-1 focus:ring-[#1791cf]" placeholder="Search..." type="search"/>
            </div>
            <button 
              onClick={() => navigate('/upload')}
              className="rounded-full p-2 hover:bg-[#1791cf]/20 bg-[#1791cf] text-white"
            >
              <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20">
                <path d="M12 5v14m-7-7h14"></path>
              </svg>
              <span className="sr-only">Upload</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-8 md:px-6 md:py-12">
          <h1 className="mb-8 text-center text-4xl font-bold tracking-tighter sm:text-5xl">Explore Historical Images</h1>
          
          {images.length === 0 ? (
            <div className="text-center py-20">
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto bg-[#111c21]/10 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-[#111c21]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#111c21]/70 mb-2">No images yet</h3>
                <p className="text-[#111c21]/50 mb-6">Start building your collection of historical moments</p>
                <button
                  onClick={() => navigate('/upload')}
                  className="px-6 py-3 bg-[#1791cf] hover:bg-[#1791cf]/90 text-white rounded-lg font-medium transition-all duration-300"
                >
                  Upload First Image
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {images.map((image) => (
                <Link
                  key={image.id}
                  to={`/image/${image.id}`}
                  className="group cursor-pointer"
                >
                  <div className="group overflow-hidden rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl">
                    <img 
                      alt={image.title} 
                      className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105" 
                      src={image.imageUrl}
                      loading="lazy"
                    />
                    <div className="p-4 bg-[#f6f7f8]">
                      <h3 className="text-lg font-bold">{image.title}</h3>
                      {image.description && (
                        <p className="text-sm text-[#111c21]/70 line-clamp-2">
                          {image.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1791cf]/20 bg-[#f6f7f8]">
        <div className="container mx-auto px-4 py-6 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-[#111c21]/70">© 2024 WorldScars. All rights reserved.</p>
            <div className="flex gap-4">
              <a className="text-[#111c21]/70 hover:text-[#1791cf]" href="#">
                <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 2.8 3.2 3 5.2-2.7-1.1-5.4-2-8-2.6-2.6-.7-5.3-1-8-1.3-.2 2.6-1 5.1-2.6 7.1-1.3 1.6-3 2.9-4.9 3.9 2.4-.1 4.7-.6 7-1.5 2.3-.9 4.4-2.1 6.3-3.7 1.9-1.6 3.6-3.4 5-5.5z"></path>
                </svg>
              </a>
              <a className="text-[#111c21]/70 hover:text-[#1791cf]" href="#">
                <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24">
                  <rect height="20" rx="5" ry="5" width="20" x="2" y="2"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </a>
              <a className="text-[#111c21]/70 hover:text-[#1791cf]" href="#">
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