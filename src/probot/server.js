const { records } = require("../airtable");
const { authenticate } = require("../airtable");

async function updatePR(robot, context) {
  const config = await context.config("airtable-crm.yml");
  const airtable = authenticate(config.base);
  records.update(airtable, context.github, "Pulls", context.payload);
}

function updateIssue(robot, context) {
  const config = await context.config("airtable-crm.yml");
  const airtable = authenticate(config.base);
  records.update(airtable, context.github, "Issues", context.payload);
}

function probotPlugin(robot) {
  console.log("Starting");
  robot.on("pull_request", context => updatePR(robot, context));
  robot.on("issues", context => updateIssue(robot, context));
}

process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled Rejection at:", p, "reason:", reason);
});

module.exports = probotPlugin;
