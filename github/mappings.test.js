const { mapIssue, mapCommit, mapUser, mapPR } = require("./mappings");

function fixture(name) {
  return require(`../fixtures/${name}.json`);
}

function snap(data) {
  // console.log(data);
  expect(data).toMatchSnapshot();
}

describe("mappings", () => {
  it("issue", () => snap(mapIssue(fixture("issue"))));
  it("commit", () => snap(mapCommit(fixture("commit"))));
  it("user", () => snap(mapUser(fixture("user"))));
  it("pr", () => snap(mapPR(fixture("pr"))));
});
