import React from 'react';

const ToolCard = ({ tool, onSelect }) => {
  return (
    <div 
      className="bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-700 hover:border-gray-600 cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-gray-900/20 min-h-[120px] flex flex-col justify-center"
      onClick={() => onSelect(tool)}
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="text-3xl sm:text-4xl flex-shrink-0">
          {typeof tool.icon === 'string' && tool.icon.startsWith('bi-') ? (
            <i className={`bi ${tool.icon}`}></i>
          ) : (
            tool.icon
          )}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">{tool.title}</h3>
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{tool.desc}</p>
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${getCategoryColor(tool.cat)}`}>
            {getCategoryName(tool.cat)}
          </span>
        </div>
      </div>
    </div>
  );
};

const getCategoryName = (cat) => {
  const categories = {
    'pdf': 'PDF',
    'image': 'Image',
    'text': 'Text',
    'dev': 'Developer',
    'general': 'General',
    'calc': 'Calculator',
    'convert': 'Converter',
    'health': 'Health'
  };
  return categories[cat] || cat;
};

const getCategoryColor = (cat) => {
  const colors = {
    'pdf': 'bg-red-600 text-white',
    'image': 'bg-blue-600 text-white',
    'text': 'bg-green-600 text-white',
    'dev': 'bg-purple-600 text-white',
    'general': 'bg-gray-600 text-white',
    'calc': 'bg-orange-600 text-white',
    'convert': 'bg-cyan-600 text-white',
    'health': 'bg-pink-600 text-white'
  };
  return colors[cat] || 'bg-gray-600 text-white';
};

export default ToolCard;
