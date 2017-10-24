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

function searchUsers() {
  base("Users")
    .select({
      // Selecting the first 3 records in Grid view:
      maxRecords: 3,
      view: "Grid view"
    })
    .eachPage(
      function page(records, fetchNextPage) {
        records.forEach(function(record) {
          console.log("Retrieved", record.get("Login"));
        });
        fetchNextPage();
      },
      function done(err) {
        if (err) {
          console.error(err);
          return;
        }
      }
    );
}

function createUser(user) {
  const recordFields = getUserFields(user);
  base("Users").create(recordFields, function(err, record) {
    if (err) {
      console.error(err);
      return;
    }

    console.log(`Created ${recordFields.Login} ${record.getId()}`);
  });
}

function fetchUser(login) {
  return github.users.getForUser({ username: login });
}

async function stuff() {
  const authors = require("./data/authors.json");
  for (author of authors) {
    try {
      const user = await fetchUser(author);
      await createUser(user.data);
    } catch (e) {
      console.error(e);
    }
  }
}

stuff();
// base("Users").find("rec3qJaTdBMdxegQK", function(err, record) {
//   if (err) {
//     console.error(err);
//     return;
//   }
//   console.log(record._rawJson.fields.Image);
// });
//
// { id: 'rec3qJaTdBMdxegQK',
//   fields:
//    { Login: 'bomsy',
//      Avatar: 'https://avatars0.githubusercontent.com/u/792924?v=4',
//      Profile: 'https://github.com/bomsy',
//      Location: 'London, United Kingdom',
//      Company: 'Oath',
//      Name: 'Hubert Boma Manilla',
//      Image: [ [Object] ] },
//   createdTime: '2017-10-22T02:17:57.409Z' }

// [ { id: 'attKNS9AWBrzQ7EhM',
//     url: 'https://dl.airtable.com/Lk01V1CNQR2HqCRIR18n_792924',
//     filename: '792924',
//     size: 25202,
//     type: 'image/jpeg',
//     thumbnails: { small: [Object], large: [Object] } } ]
