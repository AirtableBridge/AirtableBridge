/*
getAuthors is a deprecated script used to get the list of authors and members
* authors were a search over the commits
* members were a search over the gh teams

*/

// const Octokit = require("Octokit");
const keys = require("./keys.json");
const GitHubApi = require("github");
const _ = require("lodash");
const github = new GitHubApi({
  // optional
  // debug: true
});
github.authenticate({
  type: "token",
  token: keys.github
});

function searchIssues(page, cbk) {
  return new Promise(resolve => {
    ghrepo.issues(
      {
        page,
        per_page: 100,
        // state: "closed",
        q: "is:pr is:closed "
      },
      function(_, issues, server) {
        resolve(issues);
      }
    );
  });
}

let users = [];

async function getMembers(user) {
  const teams = await github.orgs.getTeams({
    org: "devtools-html"
  });

  const teamIds = teams.data.map(team => team.id);
  const teamMemberships = await Promise.all(
    teamIds.map(id => github.orgs.getTeamMembers({ id }))
  );
  return _.uniq(
    _.flatten(
      teamMemberships.map(teamMembers =>
        teamMembers.data.map(member => member.login)
      )
    )
  );
}

async function getAuthors() {
  let authors = [];

  for (var page = 1; page < 45; page++) {
    console.log(page);
    const commits = await github.repos.getCommits({
      owner: "devtools-html",
      repo: "debugger.html",
      per_page: 100,
      page
    });
    authors.push(
      ...commits.data.map(d => {
        if (d.author) {
          return d.author.login;
        }
        // console.log(d);
        return null;
      })
    );
    authors = _.uniq(authors);
  }

  console.log(JSON.stringify(authors));
}

async function inviteContributors() {
  const teamId = "2521165";
  const members = require("./members.json");
  const authors = require("./authors.json");

  for (let author of authors) {
    const isMember = members.includes(author);
    if (!isMember) {
      console.log(author);
      await github.orgs.addTeamMembership({
        id: teamId,
        username: author
      });
    }
  }
}

async function stuff() {
  // const b = await getAuthors();
  const b = await github.users.getForUser({ username: "belld19233" });
  console.log(b);
}

stuff();
// inviteContributors();
// console.log(authors);
