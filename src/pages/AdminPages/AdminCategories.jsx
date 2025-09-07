import React, { useState, useEffect } from 'react';
import { getCategories, deleteCategory, getCategoryStats } from '../../APIs/CategoryAPIs';
import AddCategoryForm from '../../components/AddCategoryForm';
import EditCategoryForm from '../../components/EditCategoryForm';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch categories and stats
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesData, statsData] = await Promise.all([
        getCategories(),
        getCategoryStats()
      ]);
      setCategories(categoriesData.data || categoriesData);
      setStats(statsData.data);
    } catch (err) {
      setError('Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(categoryId);
        setCategories(categories.filter(category => category.categoryId !== categoryId));
        alert('Category deleted successfully');
        // Refresh stats
        const statsData = await getCategoryStats();
        setStats(statsData.data);
      } catch (err) {
        alert('Failed to delete category');
        console.error('Error deleting category:', err);
      }
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setShowEditForm(true);
  };

  const handleAddCategory = () => {
    setShowAddForm(true);
  };

  const handleCloseForms = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setEditingCategory(null);
  };

  const handleCategoryAdded = (newCategory) => {
    setCategories([...categories, newCategory.data]);
    setShowAddForm(false);
    // Refresh stats
    getCategoryStats().then(data => setStats(data.data));
  };

  const handleCategoryUpdated = (updatedCategory) => {
    setCategories(categories.map(category => 
      category.categoryId === updatedCategory.category.categoryId ? updatedCategory.category : category
    ));
    setShowEditForm(false);
    setEditingCategory(null);
  };

  // Filter categories based on search term
  const filteredCategories = categories.filter(category => 
    category.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading categories...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Category Management</h1>
        <button
          onClick={handleAddCategory}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add New Category
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Categories</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalCategories}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Recent Categories</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.recentCategories?.length || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Categories</p>
                <p className="text-2xl font-semibold text-gray-900">{categories.length}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Control */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCategories.map((category) => (
          <div key={category.categoryId} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 relative">
              {category.categoryImage ? (
                <img
                  src={`http://localhost:5000${category.categoryImage}`}
                  alt={category.categoryName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center text-white text-4xl font-bold"
                  style={{ backgroundColor: category.bgColor || '#3B82F6' }}
                >
                  {category.categoryName.charAt(0)}
                </div>
              )}
              <div className="absolute top-2 right-2">
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="p-1 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all"
                    title="Edit Category"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.categoryId)}
                    className="p-1 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all"
                    title="Delete Category"
                  >
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.categoryName}</h3>
              {category.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{category.description}</p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">ID: {category.categoryId}</span>
                <div 
                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: category.bgColor || '#3B82F6' }}
                  title="Category Color"
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-500 text-lg">No categories found</div>
        </div>
      )}

      {/* Add Category Form Modal */}
      {showAddForm && (
        <AddCategoryForm
          onClose={handleCloseForms}
          onCategoryAdded={handleCategoryAdded}
        />
      )}

      {/* Edit Category Form Modal */}
      {showEditForm && editingCategory && (
        <EditCategoryForm
          category={editingCategory}
          onClose={handleCloseForms}
          onCategoryUpdated={handleCategoryUpdated}
        />
      )}
    </div>
  );
};

export default AdminCategories;