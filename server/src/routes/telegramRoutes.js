const express = require('express');
const { getImage } = require('../controllers/telegramController');

const router = express.Router();

router.get('/image/:fileId', getImage);

module.exports = router;
