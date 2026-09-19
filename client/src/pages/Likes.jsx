import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useLikes } from '../hooks/useLikes.jsx';
import ProductCard from '../components/ProductCard.jsx';

export default function Likes() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isLiked } = useLikes();

  useEffect(() => {
    setLoading(true);
    api.getLikedProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const visibleProducts = products.filter((product) => isLiked(product._id));

  return (
    <div className="likes-page">
      <h1>My Likes</h1>

      {loading && <p>Loading...</p>}
      {!loading && error && <p role="alert">{error}</p>}
      {!loading && !error && visibleProducts.length === 0 && (
        <p>You haven&apos;t liked any products yet.</p>
      )}

      {!loading && !error && visibleProducts.length > 0 && (
        <div className="product-grid">
          {visibleProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
