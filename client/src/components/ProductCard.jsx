import { Link } from 'react-router-dom';
import { getProductImageUrl } from '../utils/image';
import LikeButton from './LikeButton.jsx';

export default function ProductCard({ product }) {
  const imageUrl = getProductImageUrl(product);

  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <div className="product-card-image">
        {imageUrl ? <img src={imageUrl} alt={product.name} /> : <span>No image</span>}
        <LikeButton productId={product._id} className="product-card-like" />
      </div>
      <div className="product-card-name">{product.name}</div>
      <div className="product-card-price">${product.price}</div>
    </Link>
  );
}
