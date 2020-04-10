const express = require('express');
const routes = express.Router();

const checkAuth = require('../middleware/check-auth');
const productController = require('../controllers/product');

routes.get('/', productController.getProducts);
routes.post('/', checkAuth, productController.createProduct);
routes.get('/:productId', productController.getProduct);
routes.patch('/:productId', checkAuth, productController.updateProduct);
routes.delete('/:productId', checkAuth, productController.deleteProduct);

module.exports = routes;