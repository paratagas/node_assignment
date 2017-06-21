var express = require('express');
var router = express.Router();
var api = require('../controllers/api_data.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Node assignment' });
});

/* GET api data. */
router.get('/api_data/reviews', api.getReviewsData);
router.get('/api_data/traveller_types', api.getTravellerTypesData);

module.exports = router;
