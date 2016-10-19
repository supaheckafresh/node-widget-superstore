var express = require('express');
var router = express.Router();
var moltin = require('../modules/moltin');

/**
 * The main storefront
 */
router.get('/', (req, res, next) => {
  moltin.authenticate()
    .then(moltin.getProducts)
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
  moltin.getProduct(req.params.productId)
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

  moltin.initOrder()
  //TODO: Initialize a new cart in the main route, add that to the req and allow addition of multiple items.
    .then(resp => res.json(JSON.parse(product)));
});

module.exports = router;