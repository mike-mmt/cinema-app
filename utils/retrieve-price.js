const prices = require("../prices.json");

function retrievePrice(type) {
  return prices[type];
}

module.exports = retrievePrice;
