const env = require("dotenv").config();
var Airtable = require("airtable");

module.exports = function(base) {
  base = base || (env && env.parsed && env.parsed.AIRTABLE_BASE);
  Airtable.configure({
    endpointUrl: "https://api.airtable.com",
    apiKey: (env && env.parsed && env.parsed.AIRTABLE_TOKEN) || "foo"
  });

  return Airtable.base(base);
};
