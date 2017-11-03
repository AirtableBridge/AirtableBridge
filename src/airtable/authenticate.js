const env = require("dotenv").config();
var Airtable = require("airtable");

module.exports = function(base) {
  base = base || env.parsed.AIRTABLE_BASE;
  Airtable.configure({
    endpointUrl: "https://api.airtable.com",
    apiKey: env.parsed.AIRTABLE_TOKEN
  });

  return Airtable.base(base);
};
