const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

export function getProductImageUrl(product) {
  if (!product?.image) {
    return null;
  }

  if (product.image.startsWith('http')) {
    return product.image;
  }

  return `${API_URL}/api/telegram/image/${product.image}`;
}
