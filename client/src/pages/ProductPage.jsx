import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { getProductImageUrl } from '../utils/image';
import { useCart } from '../hooks/useCart.jsx';
import LikeButton from '../components/LikeButton.jsx';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addedToCart, setAddedToCart] = useState(false);
  const [cartError, setCartError] = useState('');
  const { items, addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    setError('');

    api.getProduct(id)
      .then(setProduct)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  function handleAddToCart() {
    const existing = items.find((item) => item.productId === id);
    const currentQuantity = existing ? existing.quantity : 0;

    if (currentQuantity + 1 > product.stock) {
      setCartError('Not enough stock');
      return;
    }

    setCartError('');
    addToCart(id, 1);
    setAddedToCart(true);
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

  const imageUrl = getProductImageUrl(product);
  const categoryName = product.category?.name || 'Uncategorized';
  const outOfStock = product.stock <= 0;

  return (
    <div className="product-page">
      <Link to="/">&larr; Back</Link>

      <div className="product-page-image">
        {imageUrl ? <img src={imageUrl} alt={product.name} /> : <span>No image</span>}
        <LikeButton productId={product._id} className="product-page-like" />
      </div>

      <h1>{product.name}</h1>
      <p className="product-page-description">{product.description}</p>
      <p>Category: {categoryName}</p>
      <p className="product-page-price">${product.price}</p>
      <p>{outOfStock ? 'Out of stock' : `Stock: ${product.stock}`}</p>

      {cartError && <p role="alert">{cartError}</p>}

      <button type="button" onClick={handleAddToCart} disabled={addedToCart || outOfStock}>
        {outOfStock ? 'Out of stock' : (addedToCart ? 'Added to cart' : 'Add to Cart')}
      </button>
    </div>
  );
}
