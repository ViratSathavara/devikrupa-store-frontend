import { apiGet, apiPost, apiPut, apiDelete } from '../config/axiosConfig';

// Admin Dashboard APIs
export const getAdminDashboard = async () => {
  try {
    const result = await apiGet('/admin/dashboard');
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Error fetching admin dashboard:', error);
    throw error;
  }
};

export const getAdminAnalytics = async (timePeriod = '30') => {
  try {
    const result = await apiGet(`/admin/analytics?period=${timePeriod}`);
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Error fetching admin analytics:', error);
    throw error;
  }
};

export const adminSearch = async (query, type = 'all') => {
  try {
    const result = await apiGet(`/admin/search?q=${encodeURIComponent(query)}&type=${type}`);
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Error performing admin search:', error);
    throw error;
  }
};

// Enhanced User Management APIs
export const getAllUsers = async (page = 1, limit = 10, search = '', role = '') => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(role && { role })
    });
    
    const result = await apiGet(`/auth/?${params}`);
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getUserStats = async () => {
  try {
    const result = await apiGet('/auth/stats/overview');
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const result = await apiPost('/auth/create', userData);
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    const result = await apiGet(`/auth/${userId}`);
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const result = await apiPut(`/auth/${userId}`, userData);
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const changeUserRole = async (userId, role, secretId) => {
  try {
    const result = await apiPut(`/auth/${userId}/role`, {
      role,
      secretId
    });
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Error changing user role:', error);
    throw error;
  }
};

export const resetUserPassword = async (userId, newPassword, secretId) => {
  try {
    const result = await apiPut(`/auth/${userId}/reset-password`, {
      newPassword,
      secretId
    });
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const result = await apiDelete(`/auth/${userId}`);
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Enhanced Category Management APIs
export const getCategoryStats = async () => {
  try {
    const result = await apiGet('/categories/stats');
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Error fetching category stats:', error);
    throw error;
  }
};

export const getCategoryById = async (categoryId) => {
  try {
    const result = await apiGet(`/categories/${categoryId}`);
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
};

export const createCategory = async (categoryData) => {
  try {
    const result = await apiPost('/categories/', categoryData);
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

export const updateCategory = async (categoryId, categoryData) => {
  try {
    const result = await apiPut(`/categories/${categoryId}`, categoryData);
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    const result = await apiDelete(`/categories/${categoryId}`);
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};
