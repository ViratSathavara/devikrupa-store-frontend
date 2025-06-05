import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  console.log(orders)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/orders/my', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.status === 200) {
          setOrders(response?.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <div>No orders found.</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #000', padding: '8px' }}>No.</th>
              <th style={{ border: '1px solid #000', padding: '8px' }}>Order ID</th>
              <th style={{ border: '1px solid #000', padding: '8px' }}>Products</th>
              <th style={{ border: '1px solid #000', padding: '8px' }}>Total Price</th>
              <th style={{ border: '1px solid #000', padding: '8px' }}>Status</th>
              <th style={{ border: '1px solid #000', padding: '8px' }}>Created At</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order._id}>
                <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{index + 1}</td>
                <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{order._id}</td>
                <td style={{ border: '1px solid #000', padding: '8px' }}>
                  {order.products.map((prod, idx) => (
                    <div key={prod._id} className='flex flex-col gap-4'>
                      <div className='flex justify-around items-center'>
                        <div className='flex items-center gap-2'>
                          {prod?.productName}
                          <img src={`http://localhost:5000${prod.image}`} alt={prod.productName} style={{ width: '60px', height: '60px' }} className='rounded-full bg-white p-1' /> <br />
                        </div>
                        Quantity: {prod.quantity}
                      </div>
                      {idx !== order.products.length - 1 && <hr className='text-gray-400 my-2' />}
                    </div>
                  ))}
                </td>
                <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>₹{order.totalPrice}</td>
                <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{order.status}</td>
                <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>
                  {new Date(order.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MyOrders