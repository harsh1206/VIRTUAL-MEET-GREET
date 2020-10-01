const express = require('express');
const router = express.Router();
const roomController = require('../controllers/room_conroller');

router.get('/',roomController.room);


module.exports = router;