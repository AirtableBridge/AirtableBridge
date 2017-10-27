const _ = require("lodash");
const authenticate = require("./authenticate");
const github = authenticate();

async function screenShots(id) {
  const pr = await github.pullRequests.get({
    owner: "devtools-html",
    repo: "debugger.html",
    number: id
  });
  const comments = await github.pullRequests.getComments({
    owner: "devtools-html",
    repo: "debugger.html",
    number: id
  });
  const body = pr.data.body;
  const bodies = comments.data.map(comment => comment.body);

  const text = [body].concat(bodies).join("\n");
  const attachments = text.match(/(https:\/\/\S*?\.(JPG|PNG|jpg|png))/);
  let screens = attachments ? attachments.slice(0, attachments.length) : [];
  screens = _.uniq(screens.filter(screen => screen.includes("http")));

  return screens;
}

// (async function() {
//   screenShots(4463);
// })();

module.exports = screenShots;
