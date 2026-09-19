import { createContext, useContext, useState } from 'react';
import * as cartStore from '../utils/cart';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => cartStore.getCart());

  function addToCart(productId, quantity = 1) {
    setItems(cartStore.addToCart(productId, quantity));
  }

  function setQuantity(productId, quantity) {
    setItems(cartStore.setQuantity(productId, quantity));
  }

  function removeFromCart(productId) {
    setItems(cartStore.removeFromCart(productId));
  }

  function clearCart() {
    cartStore.clearCart();
    setItems([]);
  }

  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    items, count, addToCart, setQuantity, removeFromCart, clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
}
