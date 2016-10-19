var _ = require('lodash'),
//TODO: kill these \r chars that are appended when sourcing the .env
  ECOMMERCE_BASE_URL = _.replace(process.env.MOLTIN_API_V1, '\r', ''),
  ECOMMERCE_CLIENT_ID = _.replace(process.env.MOLTIN_CLIENT_ID, '\r', ''),
  ECOMMERCE_CLIENT_SECRET = _.replace(process.env.MOLTIN_CLIENT_SECRET, '\r', ''),
  rp = require('request-promise'),
  currentAuthToken = null;

/**
 * Get an authorization token from Moltin which we can use
 * to make other requests.
 *
 * @returns {Promise.<T>}
 */
function authenticate() {
  return rp.post({
    uri: _.replace(ECOMMERCE_BASE_URL, 'v1', 'oauth/access_token'),
    form: {
      client_id: ECOMMERCE_CLIENT_ID,
      client_secret: ECOMMERCE_CLIENT_SECRET,
      grant_type: 'client_credentials'
    }
  })
    .then(res => currentAuthToken = JSON.parse(res).access_token)
    .catch(err => console.log('ERROR', err));
}

/**
 * Configure our request objects & attach auth token before hitting
 * the Moltin api endpoints.
 *
 * @param uri
 * @param body
 * @param form
 * @returns {{uri: *, form: *, headers: {Authorization: string}}}
 */
function makeRequestObj(uri, form, body) {
  return {
    uri,
    form,
    body,
    headers: {
      Authorization: `Bearer ${currentAuthToken}`
    }
  }
}

/**
 * Get me all the products dammit!
 *
 * @returns {TRequest}
 */
function getProducts() {
  let req = makeRequestObj(`${ECOMMERCE_BASE_URL}/products`);
  return rp.get(req);
}

/**
 * Get all the deets for one product.
 *
 * @param id
 * @returns {TRequest}
 */
function getProduct(id) {
  let req = makeRequestObj(`${ECOMMERCE_BASE_URL}/products/${id}`);
  return rp.get(req);
}

/**
 * Fetch all customers for our store.
 *
 * @returns {TRequest}
 */
function getCustomers() {
  let req = makeRequestObj(`${ECOMMERCE_BASE_URL}/customers`);
  return rp.get(req);
}

/**
 * Initialize a new order, we'll be able to add items to this.
 *
 * @return {TRequest}
 */
function initOrder() {
  let req = makeRequestObj(`${ECOMMERCE_BASE_URL}/orders`, {
    status: 'unpaid',
    subtotal: 0,
    total: 0,
    currency: _.replace(process.env.MOLTIN_USD, '\r', ''),
    currency_code: 'USD',
    exchange_rate: 1
  });

  return rp.post(req);
}

module.exports = {
  authenticate,
  getProducts,
  getProduct,
  getCustomers,
  initOrder
};






