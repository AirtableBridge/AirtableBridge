const keys = require("./keys.json");
const GitHubApi = require("github");
const _ = require("lodash");
const github = new GitHubApi({});

github.authenticate({
  type: "token",
  token: keys.github
});

var Airtable = require("airtable");
Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: keys.airtable
});

var base = Airtable.base("appwQO7nufXMVj4ge");

async function getCommits() {
  let commitList = [];

  for (var page = 1; page < 46; page++) {
    console.log(page);
    const commits = await github.repos.getCommits({
      owner: "devtools-html",
      repo: "debugger.html",
      per_page: 100,
      page
    });
    commitList.push(...commits.data);
  }

  fs.writeFileSync("./data/commits.json", JSON.stringify(commitList, null, 2));
  console.log(commitList);
}

function createCommit(commit) {
  const recordFields = getCommitFields(commit);
  base("Commits").create(recordFields, function(err, record) {
    if (err) {
      console.error(err);
      return;
    }

    console.log(`Created ${recordFields.Author} ${record.getId()}`);
  });
}

async function stuff() {
  const commits = require("./data/commits.json");
  for (let commit of commits) {
    try {
      await createCommit(commit);
    } catch (e) {
      console.error(e);
      console.log(JSON.stringify(commit));
    }
  }
}

stuff();

// getCommits();
// console.log(getCommitFields(require("./fixtures/commit.json")));
