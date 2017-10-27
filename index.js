module.exports = probotPlugin

const handlePullRequestChange = require('./lib/handle-pull-request-change');
const handleIssueComment = require('./lib/handle-issue-comment');
const handleIssue = require('./lib/handle-issue');
const handleIssueLabel = require("./lib/handle-issue-label");

/*
 * docs: https://octokit.github.io/node-github/#api-users-getOrgMemberships
 * webhooks: https://developer.github.com/webhooks/
 */

function probotPlugin (robot) {
    
  robot.on('pull_request', handlePullRequestChange.bind(null, robot))
  robot.on('pull_requests', handlePullRequestChange.bind(null, robot))
  
  // robot.on('pull_request.edited', handlePullRequestChange.bind(null, robot))
  
  robot.on('issue_comment.created', handleIssueComment.bind(null, robot))
  robot.on('issue.closed', handleIssue.bind(null, robot))
  robot.on('issues', handleIssue.bind(null, robot))
  
  // robot.on('membership.added', handleIssueComment.bind(null, robot))
  // robot.on('label', handleIssueLabel.bind(null, robot))

}