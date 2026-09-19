import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';

function statusLabel(status) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');

    api.getOrder(id)
      .then(setOrder)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  if (!order) {
    return <p>Order not found.</p>;
  }

  return (
    <div className="order-detail-page">
      <Link to="/orders">&larr; Back</Link>

      <h1>Order #{order._id.slice(-6).toUpperCase()}</h1>

      <h3>Products</h3>
      <ul className="order-detail-items">
        {order.items.map((item) => (
          <li key={item.product}>{item.name} × {item.quantity}</li>
        ))}
      </ul>

      <p className="order-detail-total">Total: ${order.totalPrice}</p>

      <h3>Customer</h3>
      <p>
        {order.customer.name}<br />
        {order.customer.phone}<br />
        {order.customer.address}
      </p>

      <h3>Status</h3>
      <p className={`order-status order-status-${order.status}`}>{statusLabel(order.status)}</p>
    </div>
  );
}
