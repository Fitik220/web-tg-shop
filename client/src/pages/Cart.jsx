import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useCart } from '../hooks/useCart.jsx';
import { getProductImageUrl } from '../utils/image';

export default function Cart() {
  const { items, setQuantity, removeFromCart } = useCart();
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [stockWarning, setStockWarning] = useState({});
  const navigate = useNavigate();

  const productIds = items.map((item) => item.productId).sort().join(',');

  useEffect(() => {
    if (items.length === 0) {
      setProducts({});
      setLoading(false);
      return;
    }

    setLoading(true);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productIds]);

  function handleIncrement(item, product) {
    if (item.quantity + 1 > product.stock) {
      setStockWarning((prev) => ({ ...prev, [item.productId]: 'Not enough stock' }));
      return;
    }

    setStockWarning((prev) => ({ ...prev, [item.productId]: '' }));
    setQuantity(item.productId, item.quantity + 1);
  }

  function handleDecrement(item) {
    setStockWarning((prev) => ({ ...prev, [item.productId]: '' }));
    setQuantity(item.productId, item.quantity - 1);
  }

  const validItems = items.filter((item) => products[item.productId]);
  const missingItems = items.filter((item) => !loading && !products[item.productId]);
  const total = validItems.reduce((sum, item) => sum + products[item.productId].price * item.quantity, 0);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <h1>Cart</h1>
        <p>Your cart is empty.</p>
        <Link to="/"><button type="button">Continue Shopping</button></Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Cart</h1>

      {missingItems.length > 0 && (
        <p role="alert">Some items in your cart are no longer available and were skipped.</p>
      )}

      {validItems.map((item) => {
        const product = products[item.productId];
        const imageUrl = getProductImageUrl(product);

        return (
          <div className="cart-item" key={item.productId}>
            <div className="cart-item-image">
              {imageUrl ? <img src={imageUrl} alt={product.name} /> : <span>No image</span>}
            </div>
            <div className="cart-item-info">
              <div className="cart-item-name">{product.name}</div>
              <div className="cart-item-price">${product.price}</div>
              <div className="cart-item-controls">
                <button type="button" onClick={() => handleDecrement(item)}>-</button>
                <span>{item.quantity}</span>
                <button type="button" onClick={() => handleIncrement(item, product)}>+</button>
                <button type="button" className="cart-item-remove" onClick={() => removeFromCart(item.productId)}>
                  Remove
                </button>
              </div>
              {stockWarning[item.productId] && <p role="alert">{stockWarning[item.productId]}</p>}
            </div>
          </div>
        );
      })}

      <div className="cart-total">
        Total: ${total}
      </div>

      <button type="button" onClick={() => navigate('/checkout')} disabled={validItems.length === 0}>
        Checkout
      </button>
    </div>
  );
}
