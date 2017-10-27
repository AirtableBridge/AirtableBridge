const authenticate = require("../../github/authenticate");
const fs = require("fs");

const github = authenticate();

async function getPRs() {
  let page = 1;
  let results = [];
  let prs;
  do {
    console.log(`page ${page}`);
    prs = await github.pullRequests.getAll({
      owner: "devtools-html",
      repo: "debugger.html",
      per_page: 2,
      page
    });

    if (prs.data && prs.data.length > 0) {
      results = results.concat(prs.data);
    } else {
      console.log("done", prs);
    }
    page++;
  } while (prs.data && prs.data.length > 0);

  fs.writeFileSync("../../data/prs.json", JSON.stringify(results, null, 2));
  console.log(results);

  return prs;
}
