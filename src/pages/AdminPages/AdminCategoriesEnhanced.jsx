import React, { useState, useEffect } from 'react';
import { getCategories } from '../../APIs/CategoryAPIs';
import { 
  getCategoryStats, 
  getCategoryById, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../../APIs/AdminAPIs';
import { 
  FiFolder, 
  FiSearch, 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiRefreshCw,
  FiBarChart,
  FiTrendingUp,
  FiImage,
  FiEye
} from 'react-icons/fi';

const AdminCategoriesEnhanced = () => {
  const [categories, setCategories] = useState([]);
  const [categoryStats, setCategoryStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchCategoryStats();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getCategories();
      setCategories(response.data || response || []);
    } catch (err) {
      setError('Failed to fetch categories');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryStats = async () => {
    try {
      const stats = await getCategoryStats();
      setCategoryStats(stats);
    } catch (err) {
      console.error('Error fetching category stats:', err);
    }
  };

  const handleCreateCategory = async (categoryData) => {
    try {
      await createCategory(categoryData);
      setShowCreateModal(false);
      fetchCategories();
      fetchCategoryStats();
    } catch (err) {
      setError('Failed to create category');
      console.error('Error creating category:', err);
    }
  };

  const handleUpdateCategory = async (categoryId, categoryData) => {
    try {
      await updateCategory(categoryId, categoryData);
      setShowEditModal(false);
      setSelectedCategory(null);
      fetchCategories();
      fetchCategoryStats();
    } catch (err) {
      setError('Failed to update category');
      console.error('Error updating category:', err);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(categoryId);
        fetchCategories();
        fetchCategoryStats();
      } catch (err) {
        setError('Failed to delete category');
        console.error('Error deleting category:', err);
      }
    }
  };

  const handleViewCategory = async (categoryId) => {
    try {
      const category = await getCategoryById(categoryId);
      setSelectedCategory(category);
      setShowViewModal(true);
    } catch (err) {
      setError('Failed to fetch category details');
      console.error('Error fetching category:', err);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.categoryName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const StatCard = ({ title, value, icon: Icon, color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const CategoryModal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ×
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };

  if (loading && categories.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <FiRefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading categories...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <FiPlus className="w-4 h-4 mr-2" />
          Add Category
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Category Statistics */}
      {categoryStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Categories"
            value={categoryStats.totalCategories}
            icon={FiFolder}
            color="blue"
          />
          <StatCard
            title="Active Categories"
            value={categoryStats.activeCategories}
            icon={FiBarChart}
            color="green"
          />
          <StatCard
            title="Products in Categories"
            value={categoryStats.totalProducts}
            icon={FiTrendingUp}
            color="purple"
          />
          <StatCard
            title="Recent Activity"
            value={categoryStats.recentActivity}
            icon={FiRefreshCw}
            color="orange"
          />
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <div key={category.categoryId} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FiFolder className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{category.categoryName}</h3>
                    <p className="text-sm text-gray-500">ID: {category.categoryId}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewCategory(category.categoryId)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <FiEye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowEditModal(true);
                    }}
                    className="text-green-600 hover:text-green-900"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.categoryId)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {category.description && (
                <p className="text-sm text-gray-600 mb-4">{category.description}</p>
              )}
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Created: {new Date(category.createdAt).toLocaleDateString()}</span>
                <span>Products: {category.productCount || 0}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-8">
          <FiFolder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No categories found</p>
        </div>
      )}

      {/* Create Category Modal */}
      <CategoryModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Category"
      >
        <CreateCategoryForm onSubmit={handleCreateCategory} onCancel={() => setShowCreateModal(false)} />
      </CategoryModal>

      {/* Edit Category Modal */}
      <CategoryModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedCategory(null);
        }}
        title="Edit Category"
      >
        {selectedCategory && (
          <EditCategoryForm
            category={selectedCategory}
            onSubmit={(categoryData) => handleUpdateCategory(selectedCategory.categoryId, categoryData)}
            onCancel={() => {
              setShowEditModal(false);
              setSelectedCategory(null);
            }}
          />
        )}
      </CategoryModal>

      {/* View Category Modal */}
      <CategoryModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedCategory(null);
        }}
        title="Category Details"
      >
        {selectedCategory && (
          <ViewCategoryForm
            category={selectedCategory}
            onClose={() => {
              setShowViewModal(false);
              setSelectedCategory(null);
            }}
          />
        )}
      </CategoryModal>
    </div>
  );
};

// Form Components
const CreateCategoryForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    categoryName: '',
    description: '',
    image: null
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
        <input
          type="text"
          value={formData.categoryName}
          onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create Category
        </button>
      </div>
    </form>
  );
};

const EditCategoryForm = ({ category, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    categoryName: category.categoryName || '',
    description: category.description || '',
    image: null
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
        <input
          type="text"
          value={formData.categoryName}
          onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        {category.image && (
          <p className="text-sm text-gray-500 mt-1">Current image: {category.image}</p>
        )}
      </div>
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Update Category
        </button>
      </div>
    </form>
  );
};

const ViewCategoryForm = ({ category, onClose }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
        <p className="text-lg font-semibold text-gray-900">{category.categoryName}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <p className="text-gray-900">{category.description || 'No description'}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category ID</label>
        <p className="text-gray-900">{category.categoryId}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Created At</label>
        <p className="text-gray-900">{new Date(category.createdAt).toLocaleString()}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Updated At</label>
        <p className="text-gray-900">{new Date(category.updatedAt).toLocaleString()}</p>
      </div>
      {category.image && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
          <img
            src={`http://localhost:5000${category.image}`}
            alt={category.categoryName}
            className="w-full h-32 object-cover rounded-lg"
          />
        </div>
      )}
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AdminCategoriesEnhanced;
