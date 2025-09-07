import React from 'react';
import AdminNavbar from './AdminNavbar';
import AdminRoute from './AdminRoute';

const AdminLayout = ({ children }) => {
  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </AdminRoute>
  );
};

export default AdminLayout;
