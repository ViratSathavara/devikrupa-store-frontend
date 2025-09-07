import React, { useState, useEffect } from 'react';
import { getCategories } from '../../APIs/CategoryAPIs';
import { useProducts } from '../../contexts/ProductContext';
import AddProductForm from '../../components/AddProductForm';
import EditProductForm from '../../components/EditProductForm';
import ImageWithFallback from '../../components/ImageWithFallback';

const AdminProducts = () => {
  const { 
    products, 
    loading, 
    error, 
    fetchProducts, 
    removeProduct 
  } = useProducts();
  
  const [categories, setCategories] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Fetch products and categories
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      await Promise.all([
        fetchProducts(),
        getCategories().then(data => {
          console.log('AdminProducts - Raw categories data:', data);
          const categoriesData = data.data || data;
          console.log('AdminProducts - Processed categories:', categoriesData);
          setCategories(categoriesData);
        })
      ]);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await removeProduct(productId);
        alert('Product deleted successfully');
      } catch (err) {
        alert('Failed to delete product');
        console.error('Error deleting product:', err);
      }
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowEditForm(true);
  };

  const handleAddProduct = () => {
    setShowAddForm(true);
  };

  const handleCloseForms = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setEditingProduct(null);
  };

  const handleProductAdded = () => {
    setShowAddForm(false);
    // Products will be automatically updated via context
  };

  const handleProductUpdated = () => {
    setShowEditForm(false);
    setEditingProduct(null);
    // Products will be automatically updated via context
  };

  // Filter products based on search term and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.categoryId === parseInt(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading products...</div>
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
        <h1 className="text-20 font-bold text-gray-800">Product Management</h1>
        <button
          onClick={handleAddProduct}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add New Product
        </button>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="w-64">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.productId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-16 w-16 flex-shrink-0">
                      <ImageWithFallback
                        src={product.productImages && product.productImages.length > 0 
                          ? `http://localhost:5000${product.productImages[0]}` 
                          : null
                        }
                        alt={product.name}
                        className="h-16 w-16 rounded-lg object-cover"
                        fallbackText="No Image"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {product.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.companyName || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{product.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      product.stock > 10 
                        ? 'bg-green-100 text-green-800' 
                        : product.stock > 0 
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.stock} units
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.rating ? `⭐ ${product.rating}` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.productId)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-500 text-lg">No products found</div>
        </div>
      )}

      {/* Add Product Form Modal */}
      {showAddForm && (
        <AddProductForm
          categories={categories}
          onClose={handleCloseForms}
          onProductAdded={handleProductAdded}
        />
      )}
      
      {/* Debug: Show categories state */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black text-white p-2 text-xs max-w-xs">
          <div>Categories count: {categories.length}</div>
          <div>Categories: {JSON.stringify(categories.slice(0, 2))}</div>
        </div>
      )} */}

      {/* Edit Product Form Modal */}
      {showEditForm && editingProduct && (
        <EditProductForm
          product={editingProduct}
          categories={categories}
          onClose={handleCloseForms}
          onProductUpdated={handleProductUpdated}
        />
      )}
    </div>
  );
};

export default AdminProducts;