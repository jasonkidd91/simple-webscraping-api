// Initialize express router
let router = require('express').Router();
// Set default API response
router.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to RESTHub crafted with love!'
    });
});

// Import contact controller
var catalogController = require('../controllers/catalog-controller');
router.route('/catalog/:page?').get(catalogController.GET);

var productsController = require('../controllers/products-controller');
router.route('/product/:name/:page?').get(productsController.GET);

var searchController = require('../controllers/search-controller');
router.route('/search/:keyword/:page?').get(searchController.GET);

// Export API routes
module.exports = router;