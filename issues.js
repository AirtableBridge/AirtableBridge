const issue = require("./fixtures/issue.json");

function getFields(payload) {
  const {
    issue: { title, number, status, html_url, labels, user },
    body
  } = payload;

  const labelNames = labels.map(label => label.name);
  const author = user.login;

  return {
    title,
    id: number,
    status,
    labels: labelNames,
    url: html_url,
    author,
    body
  };
}

function formatDate(date) {
  const d = new Date(date);
  if (!d) {
    return null;
  }

  return `${d.getMonth() + 1}/${d.getDate()}/${d.getYear()}`;
}
function getRecordFields(payload) {
  const {
    issue: {
      title,
      number,
      state,
      html_url,
      labels,
      created_at,
      updated_at,
      closed_at,
      user,
      body
    }
  } = payload;
  const labelNames = labels.map(label => label.name);
  const author = user.login;
  // console.log({title, created_at, updated_at, closed_at, body})
  return {
    Title: title,
    ID: number,
    Open: state == "open",
    URL: html_url,
    Description: body,
    Labels: labelNames,
    Author,
    Created: formatDate(created_at),
    Updated: formatDate(updated_at),
    Closed: formatDate(closed_at)
  };
}

console.log(getFields(issue));

module.exports = { getFields };
