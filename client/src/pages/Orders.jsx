import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

function statusLabel(status) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getMyOrders()
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="orders-page">
      <h1>My Orders</h1>

      {loading && <p>Loading...</p>}
      {!loading && error && <p role="alert">{error}</p>}
      {!loading && !error && orders.length === 0 && <p>You have no orders yet.</p>}

      {!loading && !error && orders.map((order) => (
        <Link to={`/orders/${order._id}`} key={order._id} className="order-list-item">
          <div className="order-list-item-header">
            <span>Order #{order._id.slice(-6).toUpperCase()}</span>
            <span className={`order-status order-status-${order.status}`}>{statusLabel(order.status)}</span>
          </div>
          <div>${order.totalPrice}</div>
          <div className="order-list-item-date">{formatDate(order.createdAt)}</div>
        </Link>
      ))}
    </div>
  );
}
