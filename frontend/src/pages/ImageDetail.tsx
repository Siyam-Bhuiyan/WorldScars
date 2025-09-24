import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Image {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  location: string;
  uploadedAt: string;
}

const ImageDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [image, setImage] = useState<Image | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (id) {
      fetchImage(parseInt(id));
    }
  }, [id]);

  const fetchImage = async (imageId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/images/${imageId}`);
      if (response.ok) {
        const data = await response.json();
        setImage(data);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error fetching image:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center worldscars-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700"></div>
      </div>
    );
  }

  if (!image) {
    return (
      <div className="w-screen h-screen flex items-center justify-center worldscars-bg">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Image not found</h2>
          <button
            onClick={() => navigate('/gallery')}
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
          >
            Back to Gallery
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-screen min-h-screen worldscars-bg text-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-lg border-b border-gray-200/40">
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
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-full text-stone-600 hover:text-stone-800 hover:bg-stone-200/50 transition-colors">
                <svg fill="currentColor" height="20px" viewBox="0 0 256 256" width="20px">
                  <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                </svg>
              </button>
              <button className="p-2 rounded-full text-stone-600 hover:text-stone-800 hover:bg-stone-200/50 transition-colors">
                <svg fill="currentColor" height="20px" viewBox="0 0 256 256" width="20px">
                  <path d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Zm0,16V161.57l-51.77-32.35a8,8,0,0,0-8.48,0L72,161.56V48ZM132.23,177.22a8,8,0,0,0-8.48,0L72,209.57V180.43l56-35,56,35v29.14Z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-screen min-h-screen py-8">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
          {/* Breadcrumbs */}
          <div className="text-sm font-medium text-gray-600 mb-8">
            <button 
              onClick={() => navigate('/gallery')}
              className="hover:text-stone-800 transition-colors"
            >
              Collections
            </button>
            <span className="mx-2">/</span>
            <span className="text-gray-800">Historical Images</span>
          </div>

          {/* Main Image Display - Full Width */}
          <div className="mb-8">
            <div 
              className="w-full h-auto aspect-[16/10] bg-cover bg-center rounded-xl shadow-2xl overflow-hidden"
              style={{ backgroundImage: `url(${image.imageUrl})` }}
            >
              {!imageLoaded && (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-xl">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700"></div>
                </div>
              )}
              <img
                src={image.imageUrl}
                alt={image.title}
                className="w-full h-full object-cover opacity-0"
                onLoad={() => setImageLoaded(true)}
              />
            </div>
          </div>

          {/* Image Info Below */}
          <div className="mb-12">
            {/* Title with External Link */}
            <div className="flex items-start gap-3 mb-4">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 leading-tight flex-1">{image.title}</h1>
              <button
                onClick={() => {
                  // You can replace this with actual link functionality
                  console.log('External link clicked');
                }}
                className="p-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group flex-shrink-0"
                title="External Link"
              >
                <svg className="w-5 h-5 text-blue-600 group-hover:text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>
            </div>

            {/* Date and Location */}
            <div className="flex items-center gap-6 text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{formatDate(image.uploadedAt)}</span>
              </div>
              {image.location && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{image.location}</span>
                </div>
              )}
            </div>

            {/* Description */}
            {image.description && (
              <div className="bg-gray-50/80 rounded-lg p-6 max-w-4xl">
                <p className="text-lg text-gray-700 leading-relaxed">
                  {image.description}
                </p>
              </div>
            )}
          </div>

          {/* Historical Context - Full Width */}
          {image.description && (
            <div className="bg-white/60 rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Historical Context
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="text-lg leading-relaxed">
                  This photograph provides valuable insight into the historical period it represents. The image captures 
                  a moment in time that helps us understand the social, cultural, and technological context of the era. 
                  Such historical documents are essential for preserving our collective memory and understanding the 
                  evolution of society.
                </p>
                <p className="text-lg leading-relaxed mt-4">
                  Historical images like this serve as windows into the past, allowing us to witness events, people, and places 
                  that have shaped our world. They provide context for understanding how societies have evolved, how people lived, 
                  and what challenges they faced. Each photograph tells a story that extends far beyond what is visible in the frame.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ImageDetail;