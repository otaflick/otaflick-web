// File: Page404.tsx
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Search, AlertCircle } from "lucide-react";

const Page404 = () => {
  const navigate = useNavigate();

  const handleGoHome = () => navigate("/");
  const handleGoBack = () => navigate(-1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-10 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          ></div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto text-center relative z-10">
        {/* Main Content */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8 md:p-12 shadow-2xl">
          {/* Animated Icon */}
          <div className="relative inline-block mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-red-400 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto transform rotate-12 animate-float">
              <AlertCircle className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -inset-4 bg-red-500 rounded-2xl blur-lg opacity-30 animate-pulse"></div>
          </div>

          {/* 404 Number with Glitch Effect */}
          <div className="relative mb-6">
            <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-600 mb-4 glitch" data-text="404">
              404
            </h1>
          </div>

          {/* Main Message */}
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Lost in the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Digital Void</span>
          </h2>

          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            The page you're looking for has drifted into the cosmic abyss. 
            Don't worry, even the best explorers get lost sometimes.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button
              onClick={handleGoHome}
              className="group bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center gap-3 min-w-[200px] justify-center"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Beam Me Home
            </button>

            <button
              onClick={handleGoBack}
              className="group bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-xl border border-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center gap-3 min-w-[200px] justify-center"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Go Back in Time
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-black/20 rounded-2xl p-6 border border-white/10">
            <p className="text-gray-400 mb-4 font-medium">While you're here...</p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => navigate("/search")}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 transition-all duration-200 border border-white/10 hover:border-white/20"
              >
                <Search className="w-4 h-4" />
                Search Content
              </button>
              <button
                onClick={() => navigate("/movies")}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 transition-all duration-200 border border-white/10 hover:border-white/20"
              >
                🎬 Browse Movies
              </button>
              <button
                onClick={() => navigate("/shows")}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 transition-all duration-200 border border-white/10 hover:border-white/20"
              >
                📺 Watch Shows
              </button>
            </div>
          </div>
        </div>

        {/* Cosmic Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            If you believe this is an error, contact support or check the URL
          </p>
          <div className="mt-4 flex justify-center space-x-6 text-gray-600">
            <span>•</span>
            <span>•</span>
            <span>•</span>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(12deg); }
          50% { transform: translateY(-20px) rotate(12deg); }
        }
        
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .glitch {
          position: relative;
          animation: glitch 0.5s linear infinite;
        }
        
        .glitch::before,
        .glitch::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        .glitch::before {
          animation: glitch 0.3s linear infinite;
          color: #ff00ff;
          z-index: -1;
        }
        
        .glitch::after {
          animation: glitch 0.3s linear infinite reverse;
          color: #00ffff;
          z-index: -2;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Page404;