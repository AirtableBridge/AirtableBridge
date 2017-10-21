const keys = require("./keys.json");

var github = require("octonode");
var Airtable = require("airtable");
var base = new Airtable({ apiKey: keys.airtable }).base("appwQO7nufXMVj4ge");

// var GitHubApi = require("node-github");
var client = github.client(keys.github);
//
// var github = new GitHubApi({
//     version: "3.0.0"
// });
//
//
// github.search.issues({ ... });
var ghrepo = client.repo("devtools-html/debugger.html");

function searchIssues(page) {
  ghrepo.issues(
    {
      page,
      per_page: 100,
      state: "open"
    },
    function(_, issues, server) {
      issues.forEach(createRecord);
    }
  ); //array of second 100 issues which are closed
}

function formatDate(date) {
  if (!date) {
    return "";
  }

  const d = new Date(date);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getYear()}`;
}

function getRecordFields(issue) {
  const {
    title,
    number,
    state,
    html_url,
    labels,
    body,
    created_at,
    updated_at,
    closed_at
  } = issue;
  const labelNames = labels.map(label => label.name);

  return {
    Title: title,
    ID: number,
    Open: state == "open",
    URL: html_url,
    Description: body,
    Labels: labelNames,
    Created: formatDate(created_at),
    Updated: formatDate(updated_at),
    Closed: formatDate(closed_at)
  };
}

function createRecord(issue) {
  const recordFields = getRecordFields(issue);
  base("Issues").create(recordFields, function(err, record) {
    console.log(`Creating: ${recordFields.ID}`);
    if (err) {
      console.error(err);
      return;
    }
    console.log(`Created: ${record.getId()}`);
  });
}

const issue = {
  url: "https://api.github.com/repos/devtools-html/debugger.html/issues/4441",
  repository_url: "https://api.github.com/repos/devtools-html/debugger.html",
  labels_url:
    "https://api.github.com/repos/devtools-html/debugger.html/issues/4441/labels{/name}",
  comments_url:
    "https://api.github.com/repos/devtools-html/debugger.html/issues/4441/comments",
  events_url:
    "https://api.github.com/repos/devtools-html/debugger.html/issues/4441/events",
  html_url: "https://github.com/devtools-html/debugger.html/pull/4441",
  id: 266955889,
  number: 4441,
  title: "Blackboxed sources distinguished by icon in source tree ",
  user: {
    login: "tohmjudson",
    id: 12687394,
    avatar_url: "https://avatars1.githubusercontent.com/u/12687394?v=4",
    gravatar_id: "",
    url: "https://api.github.com/users/tohmjudson",
    html_url: "https://github.com/tohmjudson",
    followers_url: "https://api.github.com/users/tohmjudson/followers",
    following_url:
      "https://api.github.com/users/tohmjudson/following{/other_user}",
    gists_url: "https://api.github.com/users/tohmjudson/gists{/gist_id}",
    starred_url:
      "https://api.github.com/users/tohmjudson/starred{/owner}{/repo}",
    subscriptions_url: "https://api.github.com/users/tohmjudson/subscriptions",
    organizations_url: "https://api.github.com/users/tohmjudson/orgs",
    repos_url: "https://api.github.com/users/tohmjudson/repos",
    events_url: "https://api.github.com/users/tohmjudson/events{/privacy}",
    received_events_url:
      "https://api.github.com/users/tohmjudson/received_events",
    type: "User",
    site_admin: false
  },
  labels: [],
  state: "open",
  locked: false,
  assignee: null,
  assignees: [],
  milestone: null,
  comments: 0,
  created_at: "2017-10-19T19:12:26Z",
  updated_at: "2017-10-19T23:41:00Z",
  closed_at: null,
  author_association: "CONTRIBUTOR",
  pull_request: {
    url: "https://api.github.com/repos/devtools-html/debugger.html/pulls/4441",
    html_url: "https://github.com/devtools-html/debugger.html/pull/4441",
    diff_url: "https://github.com/devtools-html/debugger.html/pull/4441.diff",
    patch_url: "https://github.com/devtools-html/debugger.html/pull/4441.patch"
  },
  body:
    'Associated Issue: #3576 \r\n\r\n### Summary of Changes\r\n\r\n* Added blackbox  icon to sourcetree when a file is blackboxed\r\n\r\n### More info\r\n\r\nPer @jasonLaster, We most likely will need some sort of "extraData" added to the SourceTree.js => treeProps in the future for use in persisting data and passing other info we may need to live update\r\n\r\n### Screenshots/Videos\r\n![ijsnocs2nn](https://user-images.githubusercontent.com/12687394/31789241-5663105e-b4c6-11e7-96c4-c6812c34965d.gif)\r\n\r\n'
};

// console.log(fields(issue));

// createRecord(issue);
searchIssues(2);
