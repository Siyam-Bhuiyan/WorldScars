import { useNavigate } from 'react-router-dom';
// Import local assets
import image1 from '../assets/big-dust-cloud-marrakesh-city-after-earthquake.jpg';
import image2 from '../assets/photorealistic-refugee-camp.jpg';
import image3 from '../assets/photorealistic-kid-refugee-camp.jpg';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-20 bg-[#f6f7f8]/80 backdrop-blur-md border-b border-white/10">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-18">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="text-[#A78BFA]">
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"></path>
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#333333]">WorldScars</h2>
            </div>
            <nav className="hidden md:flex items-center gap-6 lg:gap-10">
              <button 
                onClick={() => navigate('/gallery')}
                className="text-xs sm:text-sm font-medium text-gray-600 hover:text-[#A78BFA] transition-colors"
              >
                Explore
              </button>
              <a className="text-xs sm:text-sm font-medium text-gray-600 hover:text-[#A78BFA] transition-colors" href="#">Collections</a>
              <a className="text-xs sm:text-sm font-medium text-gray-600 hover:text-[#A78BFA] transition-colors" href="#">About</a>
            </nav>
            <div className="flex items-center gap-1 sm:gap-2">
              <button className="rounded-full p-1.5 sm:p-2 text-gray-600 hover:text-[#A78BFA] hover:bg-[#A78BFA]/10 transition-colors">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
                </svg>
              </button>
              <button className="rounded-full p-1.5 sm:p-2 text-gray-600 hover:text-[#A78BFA] hover:bg-[#A78BFA]/10 transition-colors">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              </button>
              {/* Mobile menu button */}
              <button className="md:hidden rounded-full p-1.5 sm:p-2 text-gray-600 hover:text-[#A78BFA] hover:bg-[#A78BFA]/10 transition-colors">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="absolute inset-0 w-full h-full">
        <div className="relative h-full w-full">
          {/* Animated Background Images using local assets */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out opacity-0 animate-fade-in"
            style={{
              backgroundImage: `linear-gradient(to top, rgba(18, 18, 18, 0.8) 0%, rgba(18, 18, 18, 0.3) 40%, rgba(18, 18, 18, 0) 70%), url("${image1}")`,
              animationDelay: '0s'
            }}
          ></div>
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out opacity-0 animate-fade-in"
            style={{
              backgroundImage: `linear-gradient(to top, rgba(18, 18, 18, 0.8) 0%, rgba(18, 18, 18, 0.3) 40%, rgba(18, 18, 18, 0) 70%), url("${image2}")`,
              animationDelay: '5s'
            }}
          ></div>
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out opacity-0 animate-fade-in"
            style={{
              backgroundImage: `linear-gradient(to top, rgba(18, 18, 18, 0.8) 0%, rgba(18, 18, 18, 0.3) 40%, rgba(18, 18, 18, 0) 70%), url("${image3}")`,
              animationDelay: '10s'
            }}
          ></div>

          {/* Hero Content */}
          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl w-full">
              <div className="max-w-4xl mx-auto">
                <h1 
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight tracking-tight mb-4 sm:mb-6"
                  style={{ textShadow: '0 2px 20px rgba(0,0,0,0.7)' }}
                >
                  Images That Shaped The World
                </h1>
                <p 
                  className="text-base sm:text-lg md:text-xl lg:text-2xl font-light text-gray-200 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed"
                  style={{ textShadow: '0 2px 15px rgba(0,0,0,0.6)' }}
                >
                  A curated journey through the most influential visual moments in history and art.
                </p>
                <button
                  onClick={() => navigate('/gallery')}
                  className="inline-block bg-[#A78BFA] text-white font-bold py-3 px-8 sm:py-4 sm:px-10 lg:py-5 lg:px-12 rounded-full text-base sm:text-lg lg:text-xl hover:bg-[#A78BFA]/90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Explore the Gallery
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default Home;