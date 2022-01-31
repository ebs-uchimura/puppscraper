// define modules
const express = require('express');
const router = express.Router();

// top page
router.get('/', (req, res) => {
    res.render('index', {});
});

module.exports = router;