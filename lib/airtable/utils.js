var Airtable = require("airtable");
var fs = require("fs")
var apiKey = fs.readFileSync("./data/airtable.key").toString()
var base = new Airtable({ apiKey }).base(
  "appwQO7nufXMVj4ge"
);


async function findRecord({table, view}, id) {
  return new Promise(resolve => {
    console.log(`Searching ${table} and ${view} for ${id}`)
    let record;
    function onRecord(_record) {
      record = _record;
    }

    function page(records, fetchNextPage) {
      records.forEach(onRecord);
      fetchNextPage();
    }

    function done(err) {
      if (err) {
        return console.error(err);
      }
      resolve(record);
    }

    base(table)
      .select({
        maxRecords: 30,
        filterByFormula: `ID = ${id}`,
        view: view
      })
      .eachPage(page, done);
  });
}


function authenticate () {
  Airtable.configure({
    endpointUrl: "https://api.airtable.com",
    apiKey: apiKey
  });

  return Airtable.base("appwQO7nufXMVj4ge");
};


module.exports = {findRecord, authenticate}