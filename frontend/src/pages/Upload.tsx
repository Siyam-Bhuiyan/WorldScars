import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, Loader2, CheckCircle } from 'lucide-react';
import { imageApi } from '../services/api';
import type { ImageFormData } from '../types';

export default function Upload() {
  const [formData, setFormData] = useState<ImageFormData>({
    title: '',
    description: '',
    imageUrl: '',
  });
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: imageApi.create,
    onSuccess: () => {
      // Invalidate and refetch images
      queryClient.invalidateQueries({ queryKey: ['images'] });
      // Navigate to gallery
      navigate('/gallery');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.imageUrl) {
      mutation.mutate(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Influential Image</h1>
        <p className="text-gray-600">
          Share a powerful image that has left its mark on the world
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title Field */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Image Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="e.g., The Falling Man, Tank Man, etc."
            />
          </div>

          {/* Image URL Field */}
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Image URL *
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Description Field */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
              placeholder="Tell the story behind this influential image..."
            />
          </div>

          {/* Image Preview */}
          {formData.imageUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview
              </label>
              <div className="border rounded-lg overflow-hidden bg-gray-50">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/gallery')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={mutation.isPending || !formData.title || !formData.imageUrl}
              className={`bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg inline-flex items-center space-x-2 ${
                mutation.isPending ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : mutation.isSuccess ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>Uploaded!</span>
                </>
              ) : (
                <>
                  <UploadIcon className="h-4 w-4" />
                  <span>Upload Image</span>
                </>
              )}
            </button>
          </div>

          {/* Error Message */}
          {mutation.isError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">
                Failed to upload image. Please try again.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}