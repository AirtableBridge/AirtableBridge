const env = require("dotenv").config();
const GitHubApi = require("github");

module.exports = function() {
  const github = new GitHubApi({});

  github.authenticate({
    type: "token",
    token: env && env.parsed && env.parsed.GITHUB_TOKEN
  });

  return github;
};
