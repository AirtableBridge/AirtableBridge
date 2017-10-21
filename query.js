const keys = require("./keys.json");

var Airtable = require("airtable");
var base = new Airtable({ apiKey: keys.airtable }).base("appwQO7nufXMVj4ge");

async function findIssue(id) {
  return new Promise(resolve => {
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

    base("Issues")
      .select({
        // Selecting the first 3 records in Issues:
        maxRecords: 30,
        filterByFormula: `ID = ${id}`,
        view: "Issues"
      })
      .eachPage(page, done);
  });
}

async function query() {
  function page(records, fetchNextPage) {
    records.forEach(onRecord);
    fetchNextPage();
  }

  function done(err) {
    if (err) {
      console.error(err);
      return;
    }
  }

  const results = await base("Issues").select({
    // Selecting the first 3 records in Issues:
    maxRecords: 30,
    filterByFormula: "ID = 4448",
    view: "Issues"
  });

  results.eachPage(page, done);
}

function onRecord(record) {
  console.log("Retrieved", record._rawJson);
}

function create() {
  base("Issues").create(
    {
      Title: "something really cool",
      "Release Train": "Release",
      ID: 4297,
      URL: "https://github.com/devtools-html/debugger.html/pull/4295",
      Product: "Firefox",
      Component: "Devtools: Debugger",
      Priority: "P2",
      "Issue ID": 666
    },
    function(err, record) {
      if (err) {
        console.error(err);
        return;
      }
      console.log(record.getId());
    }
  );
}

function update() {
  base("Issues").update(
    "recL9mv3oR3FsWC8N",
    {
      Title: "something weir"
    },
    function(err, record) {
      if (err) {
        console.error(err);
        return;
      }
      console.log(record.get("Title"));
    }
  );
}
// query();
// create();
// update();
findIssue(4384).then(r => console.log(r._rawJson));
