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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-stone-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700"></div>
      </div>
    );
  }

  if (!image) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-stone-100">
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-stone-100 text-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-lg border-b border-gray-200/40">
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
      <main className="flex-1 w-full px-6 py-8 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="mx-auto max-w-5xl">
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

          {/* Image Display */}
          <div className="mb-8">
            <div 
              className="w-full h-auto aspect-[4/3] bg-cover bg-center rounded-lg"
              style={{ backgroundImage: `url(${image.imageUrl})` }}
            >
              {!imageLoaded && (
                <div className="w-full h-full flex items-center justify-center bg-[#111c21]/10 rounded-lg">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1791cf]"></div>
                </div>
              )}
              <img
                src={image.imageUrl}
                alt={image.title}
                className="w-full h-full object-cover rounded-lg opacity-0"
                onLoad={() => setImageLoaded(true)}
              />
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none text-gray-700">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{image.title}</h1>
            
            {image.description && (
              <p className="text-lg leading-relaxed mb-8">
                {image.description}
              </p>
            )}

            <h2 className="text-3xl font-bold text-gray-800 mt-12 mb-4">Historical Context</h2>
            <p className="text-lg leading-relaxed mb-8">
              This photograph provides valuable insight into the historical period it represents. The image captures 
              a moment in time that helps us understand the social, cultural, and technological context of the era. 
              Such historical documents are essential for preserving our collective memory and understanding the 
              evolution of society.
            </p>

            <h2 className="text-3xl font-bold text-gray-800 mt-12 mb-4">Metadata</h2>
            <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-x-8 gap-y-4 border-t border-gray-300/30 pt-6">
              <p className="font-medium text-gray-600">Date</p>
              <p>{formatDate(image.uploadedAt)}</p>
              
              {image.location && (
                <>
                  <p className="font-medium text-gray-600">Location</p>
                  <p>{image.location}</p>
                </>
              )}
              
              <p className="font-medium text-gray-600">Photographer</p>
              <p>Archive Collection</p>
              
              <p className="font-medium text-gray-600">Collection</p>
              <p>WorldScars Historical Archive</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-12 not-prose">
              <button
                onClick={() => window.open(image.imageUrl, '_blank')}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                View Full Resolution
              </button>
              <button
                onClick={() => navigate('/upload')}
                className="px-6 py-3 border border-gray-300 hover:border-stone-600 text-gray-700 hover:text-stone-800 rounded-lg font-medium transition-colors"
              >
                Upload Another
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ImageDetail;