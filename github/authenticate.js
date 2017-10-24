const keys = require("../keys.json");
const GitHubApi = require("github");

module.exports = function() {
  const github = new GitHubApi({});

  github.authenticate({
    type: "token",
    token: keys.github
  });

  return github;
};
