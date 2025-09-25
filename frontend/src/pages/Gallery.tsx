import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface Image {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  location: string;
  source: string;
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
      <div className="min-h-screen flex items-center justify-center worldscars-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700"></div>
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen worldscars-bg">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-20 bg-gray-50/95 backdrop-blur-lg border-b border-gray-200/40">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
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
                onClick={() => navigate('/')}
                className="text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-800 transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => navigate('/gallery')}
                className="text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-800 transition-colors"
              >
                Gallery
              </button>
              <button 
                onClick={() => navigate('/upload')}
                className="text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-800 transition-colors"
              >
                Upload
              </button>
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
      <main className="w-screen min-h-screen pt-24 pb-8">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
          <div className="mb-16 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-800 sm:text-5xl lg:text-6xl mb-6">
              Historical Images
            </h1>
            <p className="max-w-screen-md mx-auto text-lg text-gray-600 leading-relaxed">
              Discover powerful moments that shaped our world.
            </p>
          </div>

          {images.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto bg-gray-100/50 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-3">No images yet</h3>
             
              <button
                onClick={() => navigate('/upload')}
                className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-gray-50 text-lg font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                Upload First Image
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {images.map((image) => (
              <Link
                key={image.id}
                to={`/image/${image.id}`}
                className="group cursor-pointer block"
              >
                <div className="relative overflow-hidden rounded-2xl bg-gray-800 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-gray-700 hover:border-gray-600">
                  {/* Image Container */}
                  <div className="relative aspect-[6/4] overflow-hidden bg-gray-600">
                    <img 
                      alt={image.title} 
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" 
                      src={image.imageUrl}
                      loading="lazy"
                    />
                    
                    {/* Always Visible Border for White Images */}
                    <div className="absolute inset-0 border border-gray-400/20"></div>

                    {/* Enhanced Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Content Overlay - Only Visible on Hover */}
                    <div className="absolute inset-0 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-95 group-hover:scale-100">
                      <div className="text-center px-4">
                        {/* Large Title - Center focus */}
                        <h3 className="text-3xl md:text-4xl font-black line-clamp-3 leading-tight text-white drop-shadow-2xl mb-6 tracking-wide">
                          {image.title}
                        </h3>
                        
                        {/* Minimal Metadata - Simple line */}
                        <div className="flex items-center justify-center gap-4 text-sm text-white/80">
                          {image.location && (
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                              <span className="font-medium">{image.location}</span>
                            </div>
                          )}
                          
                          {image.source && (
                            <>
                              <div className="w-px h-4 bg-white/30"></div>
                              <a 
                                href={image.source} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 hover:text-blue-300 transition-colors"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                <span className="font-medium">Source</span>
                              </a>
                            </>
                          )}
                          
                          <div className="w-px h-4 bg-white/30"></div>
                          
                          <div className="font-medium">
                            {new Date(image.uploadedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Top Action Button - Better visibility */}
                    <div className="absolute top-4 right-4 opacity-90 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100">
                      <div className="w-10 h-10 bg-gray-900/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl hover:bg-gray-800 hover:scale-110 transition-all duration-200 border border-white/20">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Loading State */}
                    <div className="absolute inset-0 bg-gray-800 animate-pulse opacity-0 transition-opacity duration-200" style={{display: 'none'}}></div>
                  </div>
                  
                  {/* Card Border Highlight */}
                  <div className="absolute inset-0 rounded-2xl ring-2 ring-transparent group-hover:ring-blue-400/40 transition-all duration-300"></div>
                  
                  {/* Bottom Gradient Reflection */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400/0 via-blue-400/60 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </Link>
            ))}
          </div>
        )}
        </div>
      </main>
    </div>
  );
};

export default Gallery;