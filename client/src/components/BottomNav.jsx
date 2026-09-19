import { NavLink } from 'react-router-dom';
import { useCart } from '../hooks/useCart.jsx';

export default function BottomNav() {
  const { count } = useCart();

  return (
    <nav className="bottom-nav">
      <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
        <span>🏠</span>
        <span>Home</span>
      </NavLink>
      <NavLink to="/likes" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
        <span>❤️</span>
        <span>Likes</span>
      </NavLink>
      <NavLink to="/cart" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
        <span className="nav-cart-icon">
          🛒
          {count > 0 && <span className="nav-badge">{count}</span>}
        </span>
        <span>Cart</span>
      </NavLink>
      <NavLink to="/orders" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
        <span>📦</span>
        <span>Orders</span>
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
        <span>👤</span>
        <span>Profile</span>
      </NavLink>
    </nav>
  );
}
