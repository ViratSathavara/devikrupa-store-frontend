# Product Management System

This document describes the product management functionality implemented for the Devikrupa Electricals admin panel.

## Features

### Backend APIs (Already Implemented)
- **GET /products** - Fetch all products
- **GET /products/:productId** - Fetch product by ID
- **GET /products/category/:categoryName** - Fetch products by category
- **POST /products** - Create new product (Admin only)
- **PUT /products/:productId** - Update product (Admin only)
- **DELETE /products/:productId** - Delete product (Admin only)

### Frontend Components

#### 1. AdminProducts Component
- **Location**: `src/pages/AdminPages/AdminProducts.jsx`
- **Features**:
  - Display all products in a table format
  - Search products by name or company
  - Filter products by category
  - Add new products
  - Edit existing products
  - Delete products
  - Real-time product count and status indicators

#### 2. AddProductForm Component
- **Location**: `src/components/AddProductForm.jsx`
- **Features**:
  - Form for adding new products
  - Image upload (up to 6 images)
  - Form validation
  - Category selection
  - Price, stock, and rating inputs

#### 3. EditProductForm Component
- **Location**: `src/components/EditProductForm.jsx`
- **Features**:
  - Form for editing existing products
  - Pre-populated with current product data
  - Image management (existing + new images)
  - Form validation
  - Category selection

#### 4. Enhanced ProductContext
- **Location**: `src/contexts/ProductContext.jsx`
- **Features**:
  - Centralized product state management
  - CRUD operations integration
  - Loading and error states
  - Custom hook for easy usage

#### 5. Updated ProductsAPI
- **Location**: `src/APIs/ProductsAPI.jsx`
- **Features**:
  - Complete CRUD operations
  - Authentication token handling
  - FormData support for file uploads
  - Error handling

## Usage

### For Admins

1. **Access Product Management**:
   - Navigate to Admin Panel → Products
   - View all products in a comprehensive table

2. **Add New Product**:
   - Click "Add New Product" button
   - Fill in product details (name, description, price, etc.)
   - Select category from dropdown
   - Upload product images (up to 6 images)
   - Click "Add Product"

3. **Edit Product**:
   - Click "Edit" button next to any product
   - Modify product details
   - Add or remove images
   - Click "Update Product"

4. **Delete Product**:
   - Click "Delete" button next to any product
   - Confirm deletion in the popup

5. **Search and Filter**:
   - Use search bar to find products by name or company
   - Use category dropdown to filter by category

### Technical Details

#### File Upload
- Supports multiple image uploads (up to 6 images)
- File types: JPEG, PNG only
- Maximum file size: 2MB per image
- Images are stored in `/uploads` directory on backend

#### Authentication
- All admin operations require authentication
- JWT token is automatically included in API requests
- Admin middleware protects backend routes

#### Data Validation
- Required fields: name, description, price, categoryId
- Price must be a positive number
- Stock must be a non-negative integer
- Rating must be between 0 and 5
- At least one product image is required

## API Endpoints

### Create Product
```
POST /products
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body:
- name: string (required)
- companyName: string
- description: string (required)
- price: number (required)
- categoryId: number (required)
- stock: number
- rating: number
- productImages: File[] (required)
```

### Update Product
```
PUT /products/:productId
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body: Same as create product
```

### Delete Product
```
DELETE /products/:productId
Authorization: Bearer <token>
```

## Error Handling

The system includes comprehensive error handling:
- Form validation errors
- API error responses
- File upload errors
- Network connectivity issues
- Authentication errors

## Future Enhancements

Potential improvements for the product management system:
1. Bulk product operations (import/export)
2. Product variants (size, color, etc.)
3. Advanced filtering and sorting
4. Product analytics and reporting
5. Inventory management
6. Product reviews and ratings management


