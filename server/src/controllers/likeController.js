const likeService = require('../services/likeService');

async function likeProduct(req, res, next) {
  try {
    await likeService.likeProduct(req.user._id, req.params.id);
    res.json({ message: 'Product liked' });
  } catch (error) {
    next(error);
  }
}

async function unlikeProduct(req, res, next) {
  try {
    await likeService.unlikeProduct(req.user._id, req.params.id);
    res.json({ message: 'Product unliked' });
  } catch (error) {
    next(error);
  }
}

async function getMyLikes(req, res, next) {
  try {
    const products = await likeService.getLikedProducts(req.user._id);
    res.json(products);
  } catch (error) {
    next(error);
  }
}

module.exports = { likeProduct, unlikeProduct, getMyLikes };
