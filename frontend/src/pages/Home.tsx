import { Link } from 'react-router-dom';
import { ArrowRight, Camera, Globe, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-16">
        <div className="flex justify-center mb-6">
          <Globe className="h-16 w-16 text-blue-600" />
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          World's Most <span className="text-blue-600">Influential Images</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Discover the most powerful photographs that have shaped our world. 
          From historical moments to artistic masterpieces, explore the images 
          that left lasting scars on humanity's collective memory.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/gallery"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg inline-flex items-center space-x-2"
          >
            <Camera className="h-5 w-5" />
            <span>Explore Gallery</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          
          <Link
            to="/upload"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors duration-200 inline-flex items-center space-x-2"
          >
            <Sparkles className="h-5 w-5" />
            <span>Contribute Image</span>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 py-16">
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 p-6 text-center">
          <div className="flex justify-center mb-4">
            <Camera className="h-12 w-12 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Curated Collection</h3>
          <p className="text-gray-600">
            Carefully selected images that have made significant impact on history, 
            culture, and society worldwide.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 p-6 text-center">
          <div className="flex justify-center mb-4">
            <Globe className="h-12 w-12 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Global Stories</h3>
          <p className="text-gray-600">
            From every corner of the world, discover photographs that tell 
            powerful stories of human experience and achievement.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 p-6 text-center">
          <div className="flex justify-center mb-4">
            <Sparkles className="h-12 w-12 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Interactive Experience</h3>
          <p className="text-gray-600">
            Modern, responsive interface that brings these historical moments 
            to life with rich context and immersive viewing.
          </p>
        </div>
      </div>
    </div>
  );
}