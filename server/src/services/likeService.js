const User = require('../models/User');
const Product = require('../models/Product');

async function likeProduct(userId, productId) {
  const product = await Product.findById(productId);

  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  await User.updateOne(
    { _id: userId },
    { $addToSet: { likedProducts: productId } },
  );
}

async function unlikeProduct(userId, productId) {
  await User.updateOne(
    { _id: userId },
    { $pull: { likedProducts: productId } },
  );
}

async function getLikedProducts(userId) {
  const user = await User.findById(userId).populate({
    path: 'likedProducts',
    populate: { path: 'category', select: 'name' },
  });

  return user ? user.likedProducts : [];
}

module.exports = { likeProduct, unlikeProduct, getLikedProducts };
