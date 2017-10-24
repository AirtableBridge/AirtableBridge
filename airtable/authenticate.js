const keys = require("../keys.json");
var Airtable = require("airtable");

module.exports = function() {
  Airtable.configure({
    endpointUrl: "https://api.airtable.com",
    apiKey: keys.airtable
  });

  return Airtable.base("appwQO7nufXMVj4ge");
};
