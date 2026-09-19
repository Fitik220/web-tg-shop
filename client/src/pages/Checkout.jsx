import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth.jsx';
import { useCart } from '../hooks/useCart.jsx';

export default function Checkout() {
  const { user } = useAuth();
  const { items, clearCart } = useCart();
  const navigate = useNavigate();

  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
    }
  }, [user]);

  useEffect(() => {
    if (items.length === 0) {
      setLoading(false);
      return;
    }

    Promise.all(items.map((item) => api.getProduct(item.productId).catch(() => null)))
      .then((results) => {
        const map = {};
        results.forEach((product, index) => {
          if (product) {
            map[items[index].productId] = product;
          }
        });
        setProducts(map);
      })
      .finally(() => setLoading(false));
  }, [items]);

  const validItems = items.filter((item) => products[item.productId]);
  const total = validItems.reduce((sum, item) => sum + products[item.productId].price * item.quantity, 0);

  async function handleSubmit(e) {
    e.preventDefault();

    if (submitting) {
      return;
    }

    setError('');

    if (!name || !phone || !address) {
      setError('Please fill in all fields');
      return;
    }

    setSubmitting(true);

    try {
      const order = await api.createOrder({
        items: validItems.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        customer: { name, phone, address },
      });
      clearCart();
      setCreatedOrder(order);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (createdOrder) {
    return (
      <div className="checkout-page">
        <h1>Order created successfully!</h1>
        <p>Order #{createdOrder._id.slice(-6).toUpperCase()}</p>
        <p>Total: ${createdOrder.totalPrice}</p>
        <div className="checkout-success-actions">
          <button type="button" onClick={() => navigate(`/orders/${createdOrder._id}`)}>View Order</button>
          <button type="button" onClick={() => navigate('/')}>Continue Shopping</button>
        </div>
      </div>
    );
  }

  if (!loading && items.length === 0) {
    return (
      <div className="checkout-page">
        <h1>Checkout</h1>
        <p>Your cart is empty.</p>
        <Link to="/"><button type="button">Continue Shopping</button></Link>
      </div>
    );
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="phone">Phone</label>
          <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="address">Address</label>
          <input id="address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
        </div>

        <p className="checkout-total">Order total: ${total}</p>

        {error && <p role="alert">{error}</p>}

        <button type="submit" disabled={submitting || validItems.length === 0}>
          {submitting ? 'Creating Order...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
}
