const { authenticate, search } = require("../../github");
const {
  records,
  authenticate: authenticateAirtable
} = require("../../airtable");
const { mapPR } = require("../../github/mappings");
const fs = require("fs");
const path = require("path");

const github = authenticate();
const airtable = authenticateAirtable();

function readPRs() {
  return require("../../data/prs.json");
}

async function getPRs() {
  return search({ cache: true }, "Prs", page =>
    github.pullRequests.getAll({
      owner: "devtools-html",
      repo: "debugger.html",
      per_page: 100,
      state: "all",
      page
    })
  );
}

(async function() {
  const prs = await getPRs();
  // console.log(prs[0]);
  for (pr of prs) {
    await records.update(airtable, github, "Pulls", pr);
  }
  // console.log(prs);
})();
