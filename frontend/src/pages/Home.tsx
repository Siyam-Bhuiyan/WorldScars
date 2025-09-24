import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        World's Most Influential Images
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Discover powerful photographs that have shaped our world and left lasting impacts on history.
      </p>
      
      <div className="space-x-4">
        <Link
          to="/gallery"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
        >
          View Gallery
        </Link>
        <Link
          to="/upload"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium"
        >
          Add Image
        </Link>
      </div>
    </div>
  );
}