const express = require('express');
const router = express.Router();
const roomController = require('../controllers/room_conroller');

router.get('/',roomController.room);
router.get('/split',roomController.split);


module.exports = router;