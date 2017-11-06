const { authenticate, search } = require("../../github");
const {
  records,
  authenticate: authenticateAirtable
} = require("../../airtable");
const cache = require("../../utils/cache");
const debug = require("debug")("devtools-bot");
const airtable = authenticateAirtable();
const github = authenticate();

async function getIssues() {
  const { owner, repo } = process.env;
  if (!owner || !repo) {
    throw new Error(`Missing owner ${owner}, repo ${repo}`);
  }

  return search({ cache: true }, "issues", page =>
    github.issues.getForRepo({
      owner,
      repo,
      per_page: 100,
      state: "all",
      page
    })
  );
}

(async () => {
  const issues = await getIssues();
  const payloads = issues.map(issue => ({ issue }));
  await records.updateRecords(airtable, github, "Issues", payloads);
})();

process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled Rejection at:", p, "reason:", reason);
});
