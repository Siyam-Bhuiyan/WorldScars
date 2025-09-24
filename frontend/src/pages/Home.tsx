import { useNavigate } from 'react-router-dom';
// Import local assets
import image1 from '../assets/big-dust-cloud-marrakesh-city-after-earthquake.jpg';
import image2 from '../assets/photorealistic-refugee-camp.jpg';
import image3 from '../assets/photorealistic-kid-refugee-camp.jpg';


const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen w-full overflow-hidden">

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