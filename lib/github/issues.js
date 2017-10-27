
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
    Author: author,
    Created: formatDate(created_at),
    Updated: formatDate(updated_at),
    Closed: formatDate(closed_at)
  };
}

module.exports = {getRecordFields}