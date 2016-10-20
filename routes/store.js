'use strict';

var express = require('express');
var router = express.Router();
var store = require('../modules/moltin');

let cartId;

/**
 * Initialize an empty cart in our store.
 */
function initOrder() {
  store.initOrder()
    .then(resp => cartId = JSON.parse(resp).result.id);
}

/**
 * Whenever we encounter a route with :product, get the product from the
 * store, and put it on the request.
 */
router.param('product', (req, res, next, id) => {
  store.getProduct(id)
    .then(resp => {
      req.product = JSON.parse(resp).result;
      next();
    });
});

/**
 * The main storefront
 */
router.get('/', (req, res, next) => {
  store.authenticate()
    .then(initOrder)
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
router.get('/detail/:product', (req, res, next) => {
  res.render('product-detail', {
    product: req.product
  });
});

/**
 * Add an item to the cart.
 */
router.post('/cart/:product', (req, res, next) => {
  store.addToCart(cartId, req.product.id)
    .then(resp => {
      res.json({
        ALRIGHTY: 'That seems to have worked',
        'This product was added to your cart': JSON.parse(resp).result
      })
    });
});

module.exports = router;