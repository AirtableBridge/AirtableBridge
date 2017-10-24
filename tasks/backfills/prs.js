const authenticate = require("../../github/authenticate");
const authenticateAirtable = require("../../airtable/authenticate");
const { mapPR } = require("../../github/mappings");
const fs = require("fs");
const path = require("path");

const github = authenticate();
const airtable = authenticateAirtable();

async function createPR(pr) {
  return new Promise(resolve => {
    const data = mapPR(pr);
    airtable("Pulls").create(data, function(err, record) {
      if (err) {
        console.log(`Error: ${err.message}`);
        resolve(false);
        return;
      }
      resolve(true);
      console.log(`Created ${data.Title} ${record.getId()}`);
    });
  });
}

function readPRs() {
  return require("../../data/prs.json");
}

async function getPRs() {
  let page = 1;
  let results = [];
  let prs;
  do {
    console.log(`page ${page}`);
    prs = await github.pullRequests.getAll({
      owner: "devtools-html",
      repo: "debugger.html",
      per_page: 100,
      state: "all",
      page
    });

    if (prs.data && prs.data.length > 0) {
      results = results.concat(prs.data);
    }

    page++;
  } while (prs.data && prs.data.length > 0);

  fs.writeFileSync(
    path.join(__dirname, "../../data/prs.json"),
    JSON.stringify(results, null, 2)
  );
  return results;
}

async function createPRs(prs) {
  for (pr of prs) {
    const tries = 1;
    let success;
    do {
      success = await createPR(pr);
    } while (!success && tries++ < 3);

    if (!success) {
      console.log(`Failed: ${pr.ID}`);
    }
  }
}

(async function() {
  // const prs = await getPRs();
  const prs = readPRs();
  // console.log(prs.length);
  await createPRs(prs);
  // console.log(prs);
})();
