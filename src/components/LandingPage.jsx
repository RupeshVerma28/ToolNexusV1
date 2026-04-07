import React, { useEffect, useState } from "react";
import { TOOLS_ALL, TOOL_CATEGORIES } from "../data/toolsData";

const LandingPage = ({ onGetStarted }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    // If the event was captured globally during the initial loader, use it
    if (window.__deferredPrompt) {
      setDeferredPrompt(window.__deferredPrompt);
      setShowInstall(true);
    }
    const handler = (e) => {
      e.preventDefault();
      window.__deferredPrompt = e;
      setDeferredPrompt(e);
      setShowInstall(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    // optionally handle outcome: 'accepted' | 'dismissed'
    setDeferredPrompt(null);
    setShowInstall(false);
  };

  const toolsByCategory = TOOLS_ALL.reduce((acc, tool) => {
    if (!acc[tool.cat]) {
      acc[tool.cat] = [];
    }
    acc[tool.cat].push(tool);
    return acc;
  }, {});

  const handleLearnMore = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gray-900">
        <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Prodexify
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-6 sm:mb-8 leading-relaxed px-2">
              Your Ultimate Digital Toolkit - 30+ Powerful Tools in One Place
            </p>
            <p className="text-base sm:text-lg text-gray-300 mb-8 sm:mb-12 max-w-3xl mx-auto px-4">
              Streamline your workflow with our comprehensive collection of PDF
              tools, image processors, calculators, converters, and more. All
              tools work entirely in your browser - no uploads, no privacy
              concerns.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <button
                onClick={onGetStarted}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto"
              >
                Explore Tools
              </button>

              {/* Install PWA button (shown when beforeinstallprompt fires) */}
              {showInstall && (
                <button
                  onClick={handleInstallClick}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto"
                >
                  Install App
                </button>
              )}

              <button
                onClick={() => {
                  const featuresSection = document.getElementById("features");
                  if (featuresSection)
                    featuresSection.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section id="features" className="py-12 sm:py-16 md:py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 px-2">
              Why Choose Prodexify?
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              We've combined the most essential digital tools into one powerful,
              user-friendly platform
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
            <div className="text-center p-4 sm:p-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="bi bi-shield-check text-2xl sm:text-3xl text-white"></i>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                100% Private
              </h3>
              <p className="text-gray-300 text-sm sm:text-base">
                All processing happens in your browser. No data is sent to our
                servers, ensuring complete privacy and security.
              </p>
            </div>

            <div className="text-center p-4 sm:p-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="bi bi-lightning-charge text-2xl sm:text-3xl text-white"></i>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                Lightning Fast
              </h3>
              <p className="text-gray-300 text-sm sm:text-base">
                No waiting for uploads or downloads. Process files instantly
                with our optimized client-side tools.
              </p>
            </div>

            <div className="text-center p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="bi bi-tools text-2xl sm:text-3xl text-white"></i>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                All-in-One
              </h3>
              <p className="text-gray-300 text-sm sm:text-base">
                30+ essential tools covering PDF processing, image editing,
                calculations, conversions, and more.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Categories */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-700">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 px-2">
              Explore Our Tool Categories
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              Organized by function for easy discovery and navigation
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {Object.entries(TOOL_CATEGORIES).map(([key, category]) => (
              <div
                key={key}
                className="bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 ${category.color} rounded-lg flex items-center justify-center mb-3 sm:mb-4`}
                >
                  <i
                    className={`${category.icon} text-white text-lg sm:text-xl`}
                  ></i>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">
                  {toolsByCategory[key]?.length || 0} tools available
                </p>
                <ul className="text-xs sm:text-sm text-gray-400 space-y-1">
                  {toolsByCategory[key]?.slice(0, 3).map((tool) => (
                    <li key={tool.id} className="flex items-center">
                      <i className="bi bi-check-circle text-green-400 mr-2 flex-shrink-0"></i>
                      <span className="truncate">{tool.title}</span>
                    </li>
                  ))}
                  {toolsByCategory[key]?.length > 3 && (
                    <li className="text-blue-400 font-medium">
                      +{toolsByCategory[key].length - 3} more tools
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 px-2">
            Ready to Boost Your Productivity?
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Join and become a users who rely on Prodexify for their daily
            digital tasks. Start using our tools right now - no registration
            required!
          </p>
          <button
            onClick={onGetStarted}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg w-full sm:w-auto max-w-xs sm:max-w-none"
          >
            Get Started Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 border-t border-gray-800">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-3">
          <h3 className="text-xl font-bold">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Prodexify
            </span>
          </h3>
          <p className="text-gray-400 text-sm text-center">
            Your digital toolkit
          </p>
          <div className="flex space-x-4">
            <a
              target="_blank"
              rel="noreferrer"
              href="https://www.youtube.com/@techtruth4u"
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <i className="bi bi-youtube text-lg"></i>
            </a>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://www.linkedin.com/in/rupeshverma28"
              className="text-gray-400 hover:text-blue-500 transition-colors"
            >
              <i className="bi bi-linkedin text-lg"></i>
            </a>
          </div>
          <p className="text-gray-500 text-xs text-center mt-1">
            © 2025 Rupesh Verma
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
