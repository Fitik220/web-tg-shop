const express = require('express');
const {
  createOrder, getMyOrders, getMyOrderById, getAllOrders, updateOrderStatus,
} = require('../controllers/orderController');
const protect = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/my', protect, getMyOrders);
router.get('/', protect, requireAdmin, getAllOrders);
router.get('/:id', protect, getMyOrderById);
router.patch('/:id/status', protect, requireAdmin, updateOrderStatus);

module.exports = router;
