import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Upload = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (selectedFile: File) => {
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileChange(files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title.trim()) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title.trim());
    formData.append('description', description.trim());
    formData.append('location', location.trim());

    try {
      const response = await fetch('http://localhost:8080/api/images/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        navigate('/gallery');
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-screen min-h-screen worldscars-bg text-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-gray-50/95 backdrop-blur-lg border-b border-gray-200/40">
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
                className="text-xs sm:text-sm font-medium text-stone-800 font-semibold"
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
      <main className="flex-grow w-screen min-h-screen py-8">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
              Upload New Historical Image
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Share a powerful moment in history. Fill in the details below to add your image to our curated collection.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8 bg-white/80 backdrop-blur-sm rounded-3xl p-8 lg:p-10 shadow-2xl border border-gray-200/50">
            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3" htmlFor="title">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Title
                </span>
              </label>
              <input 
                className="w-full rounded-xl h-14 px-5 bg-gray-50/80 border-2 border-gray-200/80 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-800 placeholder-gray-500 shadow-sm hover:border-gray-300" 
                id="title" 
                placeholder="e.g., 'Construction of the Golden Gate Bridge'" 
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3" htmlFor="description">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Description
                </span>
              </label>
              <textarea 
                className="w-full rounded-xl min-h-40 p-5 bg-gray-50/80 border-2 border-gray-200/80 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 resize-none text-gray-800 placeholder-gray-500 shadow-sm hover:border-gray-300" 
                id="description" 
                placeholder="Provide a detailed description of the image's historical context, significance, and any notable features that make this moment important." 
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Location and Keywords Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3" htmlFor="location">
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Location
                  </span>
                </label>
                <input 
                  className="w-full rounded-xl h-14 px-5 bg-gray-50/80 border-2 border-gray-200/80 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-800 placeholder-gray-500 shadow-sm hover:border-gray-300" 
                  id="location" 
                  placeholder="e.g., 'New York, USA'" 
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3" htmlFor="keywords">
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Keywords
                  </span>
                </label>
                <input 
                  className="w-full rounded-xl h-14 px-5 bg-gray-50/80 border-2 border-gray-200/80 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-800 placeholder-gray-500 shadow-sm hover:border-gray-300" 
                  id="keywords" 
                  placeholder="Enter keywords separated by commas" 
                  type="text"
                />
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Image File
                </span>
              </label>
              <div 
                className={`mt-3 flex justify-center px-8 pt-12 pb-14 border-3 border-dashed rounded-2xl transition-all duration-300 shadow-inner ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50/50 scale-[1.02]' 
                    : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/20 bg-gray-50/30'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="space-y-4 text-center">
                  {preview ? (
                    <div className="space-y-6">
                      <div className="relative">
                        <img 
                          src={preview} 
                          alt="Preview" 
                          className="max-w-full h-64 object-cover rounded-xl mx-auto shadow-lg border-2 border-white"
                        />
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Image ready for upload!</p>
                        <p className="text-xs text-gray-500">Click or drag to change image</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-center text-base text-gray-700">
                          <label className="relative cursor-pointer rounded-xl font-bold text-blue-600 hover:text-blue-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 transition-colors" htmlFor="file-upload">
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Choose a file</span>
                            <input 
                              className="sr-only" 
                              id="file-upload" 
                              name="file-upload" 
                              type="file"
                              accept="image/*"
                              onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                              required
                            />
                          </label>
                          <p className="pl-2 text-gray-600">or drag and drop</p>
                        </div>
                        <p className="text-sm text-gray-500 font-medium">PNG, JPG, GIF up to 10MB</p>
                        <p className="text-xs text-gray-400">High resolution images recommended</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-8">
              <button 
                className="group relative inline-flex items-center justify-center px-10 py-4 border border-transparent text-lg font-bold rounded-2xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1" 
                type="submit"
                disabled={loading || !file || !title.trim()}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
                    <span>Uploading to Collection...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span>Add to Historical Collection</span>
                  </>
                )}
                
                {/* Button Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"></div>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Upload;