const { records } = require("../../airtable");

const github = require("../github").authenticate();
const airtable = require("../airtable").authenticate();

function updatePR(robot, context) {
  records.update(github, airtable, "Pulls", context.payload.pr);
}

function updateIssue(robot, context) {
  records.update(github, airtable, "Issues", context.payload.issue);
}

function probotPlugin(robot) {
  robot.on("pull_request", context => updatePR(robot, context));
  robot.on("issue", context => updateIssue(robot, context));
}

process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled Rejection at:", p, "reason:", reason);
});

module.exports = probotPlugin;
