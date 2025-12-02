import { useState } from "react";
import { Menu, X } from "lucide-react";
import majeLogo from "../assets/images/logoAndName.jpeg";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import AdScript from "../components/ads/AdScript";
import SocialBarScript from "../components/ads/SocialBarScript";
import NativeBanner from "../components/ads/NativeBanner";
import Banner468x60 from "../components/ads/Banner468x60";

const Topbar = ({ onOpenMenu }: { onOpenMenu: () => void }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateToSection = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="w-full bg-white h-20 flex items-center z-50 fixed top-0 left-0 shadow-md border-b border-gray-200">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 lg:px-8">
        {/* Logo - Fixed sizing */}
        <div className="flex-shrink-0">
          <img 
            src={majeLogo} 
            onClick={() => navigate("/")} 
            alt="Maje" 
            className="h-20 w-auto object-contain cursor-pointer transition-transform hover:scale-105" 
          />
        </div>

        {/* Desktop nav - Centered and properly spaced */}
        <nav className="hidden md:flex items-center justify-center flex-1 max-w-2xl mx-8">
          <div className="flex items-center gap-8 lg:gap-12 text-gray-700 font-medium">
            <button 
              onClick={() => navigateToSection("/movies")} 
              className={`transition-colors duration-200 font-semibold text-lg py-2 px-1 border-b-2 ${
                isActive("/movies") 
                  ? "text-blue-600 border-blue-600" 
                  : "border-transparent hover:text-blue-600 hover:border-blue-600"
              }`}
            >
              Movies
            </button>
            <button 
              onClick={() => navigateToSection("/shows")} 
              className={`transition-colors duration-200 font-semibold text-lg py-2 px-1 border-b-2 ${
                isActive("/shows") 
                  ? "text-blue-600 border-blue-600" 
                  : "border-transparent hover:text-blue-600 hover:border-blue-600"
              }`}
            >
              Shows
            </button>
            <button 
              onClick={() => navigateToSection("/anime")} 
              className={`transition-colors duration-200 font-semibold text-lg py-2 px-1 border-b-2 ${
                isActive("/anime") 
                  ? "text-blue-600 border-blue-600" 
                  : "border-transparent hover:text-blue-600 hover:border-blue-600"
              }`}
            >
              Anime
            </button>
          </div>
        </nav>

        {/* Spacer to balance the layout */}
        <div className="hidden md:block w-24 flex-shrink-0"></div>

        {/* Mobile menu button */}
        <button
          onClick={onOpenMenu}
          aria-label="Open menu"
          className="md:hidden inline-flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-6 h-6 text-gray-800" />
        </button>
      </div>
    </header>
  );
};

const TopbarLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navigateToSection = (path: string) => {
    setMenuOpen(false);
    navigate(path);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
    <Banner468x60/>
    <AdScript/>
    <SocialBarScript/>
    <NativeBanner/>
    
      <Topbar onOpenMenu={() => setMenuOpen(true)} />

      {/* Mobile Slide-out Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[10000]"> {/* Increased z-index to be above everything */}
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <aside
            className="absolute top-0 right-0 w-80 h-full bg-white shadow-2xl rounded-l-xl p-6 flex flex-col"
          >
            {/* Header with close button */}
            <div className="flex items-center justify-between mb-8">
              <img 
                src={majeLogo} 
                alt="Maje" 
                className="h-10 w-auto object-contain" 
              />
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6 text-gray-800" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-4 flex-1">
              
              <button 
                onClick={() => navigateToSection("/movies")} 
                className={`w-full text-left py-4 px-4 rounded-lg transition-colors border-b border-gray-100 ${
                  isActive("/movies") 
                    ? "bg-blue-600 text-white" 
                    : "hover:bg-blue-50 text-gray-800"
                }`}
              >
                <span className="font-semibold text-lg">Movies</span>
              </button>
              <button 
                onClick={() => navigateToSection("/shows")} 
                className={`w-full text-left py-4 px-4 rounded-lg transition-colors border-b border-gray-100 ${
                  isActive("/shows") 
                    ? "bg-blue-600 text-white" 
                    : "hover:bg-blue-50 text-gray-800"
                }`}
              >
                <span className="font-semibold text-lg">Shows</span>
              </button>
              <button 
                onClick={() => navigateToSection("/anime")} 
                className={`w-full text-left py-4 px-4 rounded-lg transition-colors border-b border-gray-100 ${
                  isActive("/anime") 
                    ? "bg-blue-600 text-white" 
                    : "hover:bg-blue-50 text-gray-800"
                }`}
              >
                <span className="font-semibold text-lg">Anime</span>
              </button>
            </nav>
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="pt-20 min-h-screen bg-gray-50">
        <Outlet />
      </main>
    </>
  );
};

export default TopbarLayout;