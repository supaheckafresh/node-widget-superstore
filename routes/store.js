var express = require('express');
var router = express.Router();
var store = require('../modules/moltin');

/**
 * Whenever we encounter a route with :product, get the product from the
 * store, and put it on the request.
 */
router.param('product', (req, res, next, id) => {
  console.log('IN HERE', id);
});

/**
 * The main storefront
 */
router.get('/', (req, res, next) => {
  store.authenticate()
    .then(store.getProducts)
    .then(resp => {

      //TODO: for client-server architecture, probably would be doing this:
      // res.json(resp.result);

      // And not this:
      let products = JSON.parse(resp).result;
      res.render('index', {
        title: 'Widget Superstore',
        products
      });
    });
});

/**
 * Product detail
 */
router.get('/detail/:productId', (req, res, next) => {
  store.getProduct(req.params.productId)
    .then(resp => {
      let product = JSON.parse(resp).result;
      
      res.render('product-detail', { product });
    });
});

/**
 * Initialize an order & add the product
 */
router.post('/cart', (req, res, next) => {
  let product = req.body.product;

  store.initOrder()
  //TODO: Initialize a new cart in the main route, add that to the req and allow addition of multiple items.
    .then(resp => res.json(JSON.parse(product)));
});

module.exports = router;