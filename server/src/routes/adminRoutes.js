const express = require('express');
const { getStats } = require('../controllers/adminController');
const protect = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');

const router = express.Router();

router.get('/stats', protect, requireAdmin, getStats);

module.exports = router;
