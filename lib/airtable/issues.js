var Airtable = require("airtable");
var fs = require("fs")
var apiKey = fs.readFileSync("./data/airtable.key").toString()
var base = new Airtable({ apiKey }).base(
  "appwQO7nufXMVj4ge"
);

const { findRecord } = require("./utils");
const { getRecordFields } = require("../github/issues");

async function updateIssue(robot, context) {
  const { issue: { number } } = context.payload;
  const record = await findRecord({table: "Issues", view: "Issues"}, number)
  const recordFields = getRecordFields(context.payload)
  
    base("Issues").update(
    record.id,
    recordFields,
    function(err, record) {
      if (err) {
        console.error(`Error updating issue ${err}`);
        return;
      }
      console.log(`Updated: ${number} - ${record.get("Title")}`);
    }
  );
  
}


function createIssue(robot, context) {
  const record = getRecordFields(context.payload);
    base("Issues").create(
    record,
    function(err, record) {
      if (err) {
        console.error(`Error creating issue: ${err}`);
        return;
      }
      console.log(record.getId());
    }
  );
}

module.exports = {updateIssue, createIssue}