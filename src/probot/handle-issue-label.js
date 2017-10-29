/*
  issue docs:
  https://developer.github.com/v3/issues/
  https://developer.github.com/v3/issues/labels/

  event on labels:
  https://developer.github.com/v3/activity/events/types/#labelevent

  column docs:
  https://developer.github.com/v3/projects/columns/
  https://developer.github.com/v3/projects/cards/
*/

module.exports = handleIssueLabel;

async function handleIssueLabel(robot, context) {
  const payload = context.payload;
  const api = context.github;
  const comments = require("../fixtures/comments.js");

  // only handle enhancement label at this time
  if (payload.label.name != "enhancement") return;

  // - close the issue
  // ?? asked in probot slack how to

  // - create card
  const cardContent = {
    note:
      payload.issue.title +
      " " +
      payload.issue.url +
      " " +
      payload.issue.number,
    content_id: payload.issue.id, // ?? id refers to issue id or number
    content_type: "issue"
  };
  console.log(cardContent);
  // - select board
  // - add card to board

  // - issue closing comment
  // api.issues.createComment(context.issue({body:comments.enhancementClose}))
}
