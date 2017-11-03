const { records } = require("../airtable");
const { authenticate } = require("../airtable");

async function updatePR(robot, context) {
  const config = await context.config("airtable-crm.yml", {
    base: "appwQO7nufXMVj4ge"
  });
  const airtable = authenticate(config.base);
  records.update(airtable, context.github, "Pulls", context.payload.pr);
}

function updateIssue(robot, context) {
  const config = await context.config("airtable-crm.yml", {
    base: "appwQO7nufXMVj4ge"
  });
  const airtable = authenticate(config.base);
  records.update(airtable, context.github, "Issues", context.payload.issue);
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
