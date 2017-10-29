const authenticate = require("./authenticate");
const query = require("./query");

module.exports = {
  authenticate,
  query,
  records: require("./records")
};
