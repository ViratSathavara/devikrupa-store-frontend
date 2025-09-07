import React, { useState, useEffect } from 'react';
import { adminSearch } from '../../APIs/AdminAPIs';
import { 
  FiSearch, 
  FiUsers, 
  FiFolder, 
  FiPackage, 
  FiRefreshCw,
  FiFilter,
  FiEye
} from 'react-icons/fi';

const AdminSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setError('');
      const results = await adminSearch(searchQuery, searchType);
      setSearchResults(results);
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error('Error performing search:', err);
    } finally {
      setLoading(false);
    }
  };

  const SearchResultCard = ({ item, type }) => {
    const getIcon = () => {
      switch (type) {
        case 'user':
          return <FiUsers className="w-5 h-5 text-blue-600" />;
        case 'category':
          return <FiFolder className="w-5 h-5 text-green-600" />;
        case 'product':
          return <FiPackage className="w-5 h-5 text-purple-600" />;
        default:
          return <FiSearch className="w-5 h-5 text-gray-600" />;
      }
    };

    const getTitle = () => {
      switch (type) {
        case 'user':
          return item.name || item.email;
        case 'category':
          return item.categoryName;
        case 'product':
          return item.name;
        default:
          return item.name || item.title;
      }
    };

    const getSubtitle = () => {
      switch (type) {
        case 'user':
          return item.email;
        case 'category':
          return item.description || `ID: ${item.categoryId}`;
        case 'product':
          return item.description || `Price: ₹${item.price}`;
        default:
          return item.description || item.email;
      }
    };

    const getMetadata = () => {
      switch (type) {
        case 'user':
          return (
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className={`px-2 py-1 rounded-full text-xs ${
                item.role === 'admin' 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {item.role}
              </span>
              <span>Created: {new Date(item.createdAt).toLocaleDateString()}</span>
            </div>
          );
        case 'category':
          return (
            <div className="text-sm text-gray-500">
              <span>ID: {item.categoryId}</span>
              {item.productCount && (
                <span className="ml-4">Products: {item.productCount}</span>
              )}
            </div>
          );
        case 'product':
          return (
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Category: {item.category}</span>
              <span>Stock: {item.stock || 0}</span>
              <span>Rating: {item.rating || 0}/5</span>
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {getTitle()}
            </h3>
            <p className="text-sm text-gray-600 truncate">
              {getSubtitle()}
            </p>
            {getMetadata()}
          </div>
          <div className="flex-shrink-0">
            <button className="text-gray-400 hover:text-gray-600">
              <FiEye className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const SearchStats = ({ results }) => {
    if (!results) return null;

    const totalResults = (results.users?.length || 0) + 
                        (results.categories?.length || 0) + 
                        (results.products?.length || 0);

    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Search Results</h3>
          <span className="text-sm text-gray-500">
            {totalResults} result{totalResults !== 1 ? 's' : ''} found
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="flex items-center space-x-2">
            <FiUsers className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-gray-600">
              Users: {results.users?.length || 0}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <FiFolder className="w-4 h-4 text-green-600" />
            <span className="text-sm text-gray-600">
              Categories: {results.categories?.length || 0}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <FiPackage className="w-4 h-4 text-purple-600" />
            <span className="text-sm text-gray-600">
              Products: {results.products?.length || 0}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Search</h1>
        <p className="text-gray-600">Search across users, categories, and products</p>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for users, categories, or products..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="w-48">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="user">Users Only</option>
                <option value="category">Categories Only</option>
                <option value="product">Products Only</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading || !searchQuery.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <FiRefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <FiSearch className="w-4 h-4" />
              )}
              <span className="ml-2">Search</span>
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Search Results */}
      {searchResults && (
        <>
          <SearchStats results={searchResults} />
          
          {/* Users Results */}
          {searchResults.users && searchResults.users.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FiUsers className="w-5 h-5 mr-2 text-blue-600" />
                Users ({searchResults.users.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchResults.users.map((user, index) => (
                  <SearchResultCard key={index} item={user} type="user" />
                ))}
              </div>
            </div>
          )}

          {/* Categories Results */}
          {searchResults.categories && searchResults.categories.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FiFolder className="w-5 h-5 mr-2 text-green-600" />
                Categories ({searchResults.categories.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchResults.categories.map((category, index) => (
                  <SearchResultCard key={index} item={category} type="category" />
                ))}
              </div>
            </div>
          )}

          {/* Products Results */}
          {searchResults.products && searchResults.products.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FiPackage className="w-5 h-5 mr-2 text-purple-600" />
                Products ({searchResults.products.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchResults.products.map((product, index) => (
                  <SearchResultCard key={index} item={product} type="product" />
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {(!searchResults.users || searchResults.users.length === 0) &&
           (!searchResults.categories || searchResults.categories.length === 0) &&
           (!searchResults.products || searchResults.products.length === 0) && (
            <div className="text-center py-8">
              <FiSearch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No results found for "{searchQuery}"</p>
              <p className="text-gray-400 text-sm">Try different keywords or search types</p>
            </div>
          )}
        </>
      )}

      {/* Search Tips */}
      {!searchResults && (
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Search Tips</h3>
          <ul className="text-blue-800 space-y-1">
            <li>• Search by name, email, or description</li>
            <li>• Use specific keywords for better results</li>
            <li>• Filter by type to narrow down results</li>
            <li>• Try partial matches for broader results</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminSearch;
