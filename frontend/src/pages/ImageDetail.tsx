import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import { imageApi } from '../services/api';

export default function ImageDetail() {
  const { id } = useParams<{ id: string }>();
  const imageId = parseInt(id || '0', 10);

  const {
    data: image,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['image', imageId],
    queryFn: () => imageApi.getById(imageId),
    enabled: !!imageId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading image details...</p>
        </div>
      </div>
    );
  }

  if (error || !image) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Image not found or failed to load.</p>
          <Link to="/gallery" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg">
            Back to Gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          to="/gallery"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Gallery</span>
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Image */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <img
              src={image.imageUrl}
              alt={image.title}
              className="w-full h-auto object-contain max-h-96 lg:max-h-none"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found';
              }}
            />
          </div>
          
          {/* Image Actions */}
          <div className="flex justify-center">
            <a
              href={image.imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors duration-200 inline-flex items-center space-x-2"
            >
              <ExternalLink className="h-4 w-4" />
              <span>View Original</span>
            </a>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {image.title}
            </h1>
          </div>

          {image.description && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Description</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {image.description}
                </p>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Details</h2>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">ID</dt>
                <dd className="text-gray-900">#{image.id}</dd>
              </div>
            </dl>
          </div>

          {/* Actions */}
          <div className="border-t pt-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/upload"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg flex-1 text-center"
              >
                Add Another Image
              </Link>
              <Link
                to="/gallery"
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex-1 text-center"
              >
                Browse Gallery
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}