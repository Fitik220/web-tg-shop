import {
  createContext, useContext, useEffect, useState,
} from 'react';
import { api } from '../services/api';
import { useAuth } from './useAuth.jsx';

const LikesContext = createContext(null);

export function LikesProvider({ children }) {
  const { user } = useAuth();
  const [likedIds, setLikedIds] = useState(new Set());

  useEffect(() => {
    if (!user) {
      setLikedIds(new Set());
      return;
    }

    api.getLikedProducts()
      .then((products) => setLikedIds(new Set(products.map((p) => p._id))))
      .catch(() => {});
  }, [user]);

  function isLiked(productId) {
    return likedIds.has(productId);
  }

  async function toggleLike(productId) {
    if (!user) {
      return false;
    }

    const liked = likedIds.has(productId);

    setLikedIds((prev) => {
      const next = new Set(prev);
      if (liked) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });

    try {
      if (liked) {
        await api.unlikeProduct(productId);
      } else {
        await api.likeProduct(productId);
      }
    } catch {
      setLikedIds((prev) => {
        const next = new Set(prev);
        if (liked) {
          next.add(productId);
        } else {
          next.delete(productId);
        }
        return next;
      });
    }

    return true;
  }

  const value = { isLiked, toggleLike };

  return <LikesContext.Provider value={value}>{children}</LikesContext.Provider>;
}

export function useLikes() {
  const context = useContext(LikesContext);

  if (!context) {
    throw new Error('useLikes must be used within a LikesProvider');
  }

  return context;
}
