import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useDebounce } from '../hooks/useDebounce';
import ProductCard from '../components/ProductCard.jsx';

export default function Home() {
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    api.getCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');

    api.getProducts({
      search: debouncedSearch || undefined,
      category: activeCategory === 'all' ? undefined : activeCategory,
    })
      .then((data) => setProducts(data.products))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [debouncedSearch, activeCategory]);

  return (
    <div className="home">
      <div className="home-header">
        <span className="logo">🛍️ Web Shop</span>
      </div>

      <input
        className="search-input"
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="categories">
        <button
          type="button"
          className={activeCategory === 'all' ? 'category-chip active' : 'category-chip'}
          onClick={() => setActiveCategory('all')}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category._id}
            type="button"
            className={activeCategory === category.name ? 'category-chip active' : 'category-chip'}
            onClick={() => setActiveCategory(category.name)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {loading && <p>Loading...</p>}
      {!loading && error && <p role="alert">{error}</p>}
      {!loading && !error && products.length === 0 && <p>No products found.</p>}

      {!loading && !error && products.length > 0 && (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
