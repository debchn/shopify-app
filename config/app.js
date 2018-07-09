/* eslint-disable no-process-env */

const apiKey = process.env.SHOPIFY_API_KEY || 'shopify_app_api_key';
const secret = process.env.SHOPIFY_SECRET || 'shopify_app_secret';
const scopes = ['read_customers', 'write_customers'];
const testShop = process.env.TEST_SHOP || '';

module.exports = {
  apiKey,
  secret,
  scopes,
  testShop,
};
