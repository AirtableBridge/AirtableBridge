var Airtable = require("airtable");
var fs = require("fs")
var apiKey = fs.readFileSync("./data/airtable.key").toString()
var base = new Airtable({ apiKey }).base(
  "appwQO7nufXMVj4ge"
);

const {createIssue, updateIssue} = require("./airtable/issues");

async function handleIssue(robot, context) {
  const api = context.github
  const { action } = context.payload;
  
  // console.log('issue:',JSON.stringify(context.payload));
  
  if (action == "created") {
    return createIssue(robot, context);
  }
  
  return updateIssue(robot, context);
}

module.exports = handleIssue;
