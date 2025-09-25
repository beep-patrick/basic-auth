const express = require('express');
const basicAuth = require('../middleware/basicAuth');
const router = express.Router();

router.get('/', basicAuth, (req, res) => {
  res.send('hello');
});

module.exports = router;
