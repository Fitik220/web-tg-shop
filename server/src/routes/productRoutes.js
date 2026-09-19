const express = require('express');
const {
  getProducts, getProduct, createProduct, updateProduct, deleteProduct,
} = require('../controllers/productController');
const { likeProduct, unlikeProduct } = require('../controllers/likeController');
const protect = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', protect, requireAdmin, createProduct);
router.put('/:id', protect, requireAdmin, updateProduct);
router.delete('/:id', protect, requireAdmin, deleteProduct);
router.post('/:id/like', protect, likeProduct);
router.delete('/:id/like', protect, unlikeProduct);

module.exports = router;
