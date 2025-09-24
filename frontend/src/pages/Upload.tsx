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
        navigate('/');
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f6f7f8] text-[#111c21]">
      {/* Header */}
      <header className="border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="text-[#1791cf]">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 48 48">
                  <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor"></path>
                </svg>
              </div>
              <h1 className="text-xl font-bold">WorldScars</h1>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => navigate('/')}
                className="text-sm font-medium hover:text-[#1791cf] transition-colors"
              >
                Dashboard
              </button>
              <a className="text-sm font-medium hover:text-[#1791cf] transition-colors" href="#">Images</a>
              <a className="text-sm font-bold text-[#1791cf]" href="#">Upload</a>
              <a className="text-sm font-medium hover:text-[#1791cf] transition-colors" href="#">Settings</a>
            </nav>
            <div className="flex items-center gap-4">
              <button className="md:hidden p-2 rounded-lg hover:bg-slate-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h2 className="text-4xl font-bold tracking-tight">Upload New Historical Image</h2>
            <p className="mt-2 text-slate-500">Fill in the details below to add a new image to the archive.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="title">Title</label>
              <input 
                className="w-full rounded-lg h-12 px-4 bg-transparent border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#1791cf] focus:border-[#1791cf] transition-colors" 
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
              <label className="block text-sm font-medium mb-1" htmlFor="description">Detailed Description</label>
              <textarea 
                className="w-full rounded-lg min-h-36 p-4 bg-transparent border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#1791cf] focus:border-[#1791cf] transition-colors resize-none" 
                id="description" 
                placeholder="Provide a detailed description of the image's context, significance, and any notable features." 
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Date and Keywords Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="date">Location</label>
                <input 
                  className="w-full rounded-lg h-12 px-4 bg-transparent border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#1791cf] focus:border-[#1791cf] transition-colors" 
                  id="date" 
                  placeholder="e.g., 'New York, USA'" 
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="keywords">Keywords</label>
                <input 
                  className="w-full rounded-lg h-12 px-4 bg-transparent border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#1791cf] focus:border-[#1791cf] transition-colors" 
                  id="keywords" 
                  placeholder="Enter keywords separated by commas" 
                  type="text"
                />
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium mb-1">Image File</label>
              <div 
                className={`mt-1 flex justify-center px-6 pt-10 pb-12 border-2 border-dashed rounded-xl transition-all duration-300 ${
                  dragActive 
                    ? 'border-[#1791cf] bg-[#1791cf]/5' 
                    : 'border-slate-300 hover:border-slate-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="space-y-2 text-center">
                  {preview ? (
                    <div className="space-y-4">
                      <img 
                        src={preview} 
                        alt="Preview" 
                        className="max-w-full h-48 object-cover rounded-lg mx-auto"
                      />
                      <p className="text-sm text-slate-500">Click or drag to change image</p>
                    </div>
                  ) : (
                    <>
                      <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <div className="flex text-sm text-slate-600">
                        <label className="relative cursor-pointer rounded-md font-medium text-[#1791cf] hover:text-[#1791cf]/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#1791cf]" htmlFor="file-upload">
                          <span>Upload a file</span>
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
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button 
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-[#1791cf] hover:bg-[#1791cf]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1791cf] transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                type="submit"
                disabled={loading || !file || !title.trim()}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  'Upload Image'
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Upload;