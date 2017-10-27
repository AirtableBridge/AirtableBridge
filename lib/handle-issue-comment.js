module.exports = handleIssueComment


async function handleIssueComment(robot, context) {
  const api = context.github
  const commentBody = context.payload.comment.body;
  
  console.log('a',context.payload.comment.body);
  
}
