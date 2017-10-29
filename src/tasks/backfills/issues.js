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
  return search({ cache: true }, "issues", page =>
    github.issues.getForRepo({
      owner: "devtools-html",
      repo: "debugger.html",
      per_page: 100,
      state: "all",
      page
    })
  );
}

async function updateIssues(issues) {
  for (issue of issues) {
    await records.update(airtable, "Issues", issue);
  }
}

(async () => {
  const issues = await getIssues();
  await updateIssues(issues);
})();

process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled Rejection at:", p, "reason:", reason);
});
