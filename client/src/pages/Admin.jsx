import { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api';

function statusLabel(status) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    setError('');

    Promise.all([
      api.getAdminStats(),
      api.getProducts({ limit: 100 }),
    ])
      .then(([statsData, productsData]) => {
        setStats(statsData);
        setProducts(productsData.products);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(product) {
    if (!window.confirm(`Delete "${product.name}"?`)) {
      return;
    }

    setDeletingId(product._id);

    try {
      await api.deleteProduct(product._id);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  if (!stats) {
    return <p>No statistics available yet.</p>;
  }

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>

      <div className="admin-cards">
        <div className="admin-card">
          <div className="admin-card-value">{stats.users}</div>
          <div className="admin-card-label">Users</div>
        </div>
        <div className="admin-card">
          <div className="admin-card-value">{stats.products}</div>
          <div className="admin-card-label">Products</div>
        </div>
        <div className="admin-card">
          <div className="admin-card-value">{stats.categories}</div>
          <div className="admin-card-label">Categories</div>
        </div>
        <div className="admin-card">
          <div className="admin-card-value">{stats.orders.total}</div>
          <div className="admin-card-label">Orders</div>
        </div>
        <div className="admin-card admin-card-wide">
          <div className="admin-card-value">${stats.completedRevenue}</div>
          <div className="admin-card-label">Completed Revenue</div>
        </div>
      </div>

      <h2>Order Status</h2>
      <div className="admin-status-row">
        {['pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
          <div key={status} className={`order-status order-status-${status} admin-status-chip`}>
            {statusLabel(status)}: {stats.orders[status]}
          </div>
        ))}
      </div>

      <h2>Low Stock Products</h2>
      {stats.lowStockProducts.length === 0 && <p>No low stock products.</p>}
      {stats.lowStockProducts.length > 0 && (
        <ul className="admin-low-stock-list">
          {stats.lowStockProducts.map((p) => (
            <li key={p._id}>
              {p.name} — stock: {p.stock} — {p.category?.name || 'Uncategorized'}
            </li>
          ))}
        </ul>
      )}

      <h2>Products</h2>
      {products.length === 0 && <p>No products yet.</p>}
      {products.length > 0 && (
        <div className="admin-product-table">
          {products.map((product) => (
            <div className="admin-product-row" key={product._id}>
              <div className="admin-product-info">
                <div className="admin-product-name">{product.name}</div>
                <div className="admin-product-meta">
                  ${product.price} · Stock: {product.stock} · {product.category?.name || 'Uncategorized'}
                </div>
              </div>
              <button
                type="button"
                className="admin-product-delete"
                disabled={deletingId === product._id}
                onClick={() => handleDelete(product)}
              >
                {deletingId === product._id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
