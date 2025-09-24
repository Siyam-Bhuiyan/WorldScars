import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Image {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

export default function Gallery() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/images')
      .then(response => response.json())
      .then(data => {
        setImages(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600">Loading images...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Image Gallery</h1>
      
      {images.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-600 mb-4">No images yet.</p>
          <Link 
            to="/upload" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Upload First Image
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <div key={image.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={image.imageUrl}
                alt={image.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{image.title}</h3>
                <p className="text-gray-600 text-sm">{image.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}