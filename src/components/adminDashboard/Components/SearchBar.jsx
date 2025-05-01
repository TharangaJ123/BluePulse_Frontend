import React, { useState } from 'react';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';

const SearchBar = ({
  onSearch,
  placeholder = "Search...",
  filters = [],
  initialFilters = {},
  className = "",
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState(initialFilters);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value, activeFilters);
  };

  const handleFilterChange = (filter) => {
    const newFilters = {
      ...activeFilters,
      [filter]: !activeFilters[filter]
    };
    setActiveFilters(newFilters);
    onSearch(searchTerm, newFilters);
  };

  const clearSearch = () => {
    setSearchTerm('');
    onSearch('', activeFilters);
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
      <div className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={placeholder}
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <FaTimes className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Filter Toggle Button */}
          {filters.length > 0 && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium ${
                showFilters ? 'bg-blue-50 text-blue-700 border-blue-300' : 'text-gray-700 bg-white hover:bg-gray-50'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              <FaFilter className="mr-2" />
              Filters
              {Object.values(activeFilters).filter(Boolean).length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  {Object.values(activeFilters).filter(Boolean).length}
                </span>
              )}
            </button>
          )}
        </div>

        {/* Filter Options */}
        {showFilters && filters.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-gray-700">Search Filters</h3>
              {Object.values(activeFilters).some(Boolean) && (
                <button
                  onClick={() => {
                    setActiveFilters({});
                    onSearch(searchTerm, {});
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear all
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-4">
              {filters.map((filter) => (
                <label key={filter.key} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={activeFilters[filter.key] || false}
                    onChange={() => handleFilterChange(filter.key)}
                    className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">{filter.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar; 