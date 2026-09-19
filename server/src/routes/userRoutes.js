const express = require('express');
const { getMyLikes } = require('../controllers/likeController');
const protect = require('../middleware/auth');

const router = express.Router();

router.get('/me/likes', protect, getMyLikes);

module.exports = router;
