const { post, getPRs } = require("./lastWeeksPRs");

describe("lastWeeksPRs", () => {
  it("simple", async () => {
    const prs = require("./tests/fixtures/lastWeeksPRs.json");
    expect(post(prs)).toMatchSnapshot();
  });
});
