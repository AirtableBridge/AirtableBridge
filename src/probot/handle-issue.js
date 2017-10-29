const { authenticate } = require("../airtable");
const airtable = authenticate();

async function createIssue() {}

async function handleIssue(robot, context) {
  const api = context.github;
  const { action } = context.payload;

  // console.log('issue:',JSON.stringify(context.payload));

  if (action == "created") {
    return createIssue(robot, context);
  }

  return updateIssue(robot, context);
}

module.exports = handleIssue;
