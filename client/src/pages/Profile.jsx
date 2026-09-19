import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="profile-page">
      <h1>Profile</h1>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>

      <div className="profile-links">
        <Link to="/likes"><button type="button">❤️ My Likes</button></Link>
        <Link to="/orders"><button type="button">📦 My Orders</button></Link>
        {user.role === 'admin' && (
          <Link to="/admin"><button type="button">📊 Admin Dashboard</button></Link>
        )}
      </div>

      <button type="button" onClick={handleLogout}>Logout</button>
    </div>
  );
}
