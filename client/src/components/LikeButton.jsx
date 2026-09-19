import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { useLikes } from '../hooks/useLikes.jsx';

export default function LikeButton({ productId, className }) {
  const { user } = useAuth();
  const { isLiked, toggleLike } = useLikes();
  const navigate = useNavigate();
  const liked = isLiked(productId);

  function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/login');
      return;
    }

    toggleLike(productId);
  }

  return (
    <button
      type="button"
      className={`like-button ${className || ''}`}
      onClick={handleClick}
      aria-label={liked ? 'Unlike' : 'Like'}
    >
      {liked ? '♥' : '♡'}
    </button>
  );
}
