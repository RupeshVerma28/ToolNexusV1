import React, { useEffect, useState } from "react";
import { TOOLS_ALL, TOOL_CATEGORIES } from "./data/toolsData";
import { Toaster } from "react-hot-toast";
import ToolCard from "./components/ToolCard";
import ToolModal from "./components/ToolModal";
import LandingPage from "./components/LandingPage";

export default function App() {
  const [selectedTool, setSelectedTool] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  const categoryFiltered =
    selectedCategory === "all"
      ? TOOLS_ALL
      : TOOLS_ALL.filter((tool) => tool.cat === selectedCategory);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredTools = normalizedQuery
    ? categoryFiltered.filter((tool) => {
        const title = (tool.title || "").toLowerCase();
        const desc = (tool.desc || "").toLowerCase();
        const cat = (tool.cat || "").toLowerCase();
        return (
          title.includes(normalizedQuery) ||
          desc.includes(normalizedQuery) ||
          cat.includes(normalizedQuery)
        );
      })
    : categoryFiltered;

  const categories = ["all", ...Object.keys(TOOL_CATEGORIES)];

  const handleGetStarted = () => {
    setShowLandingPage(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-4 border-gray-700 border-t-blue-500 animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <img src="/favicon.ico" alt="Prodexify" className="w-10 h-10 animate-pulse" />
            </div>
          </div>
          <div className="text-xl font-semibold">Loading Prodexify...</div>
        </div>
      </div>
    );
  }

  if (showLandingPage) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setShowLandingPage(true)}
              className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
            >
              <i className="bi bi-house-door mr-2"></i>
              Back to Home
            </button>
            <h1 className="text-4xl font-bold text-center flex-1">Prodexify</h1>
            <div className="w-32"></div> {/* Spacer for centering */}
          </div>
          <p className="text-lg text-gray-300 text-center">
            Prodexify is a lightweight, user-friendly utility designed to
            simplify workflows and boost productivity by bringing multiple
            essential features together in one place
          </p>
          <div className="mt-6 max-w-2xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools by name, description, or category..."
              className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
        </div>
      </header>

      {/* Category Filter */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-base rounded-lg font-medium transition-colors duration-200 ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {category === "all"
                ? "All Tools"
                : TOOL_CATEGORIES[category].name}
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} onSelect={setSelectedTool} />
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No tools found. Try a different category or search.
            </p>
          </div>
        )}
      </div>

      {/* Tool Modal */}
      {selectedTool && (
        <ToolModal tool={selectedTool} onClose={() => setSelectedTool(null)} />
      )}
      
      <Toaster position="bottom-center" toastOptions={{ style: { background: '#1f2937', color: '#fff' } }} />
    </div>
  );
}
