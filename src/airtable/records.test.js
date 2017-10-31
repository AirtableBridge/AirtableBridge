const records = require("./records");

function getFix(name) {
  return require(`../fixtures/${name}.json`);
}

function formatCalls(api) {
  const str = getCalls(api).map(
    ({ method, calls }) =>
      `${method}\n${calls
        .map(call => call.map(foo => JSON.stringify(foo, null, 2)).join("\n"))
        .join("\n")}`
  );
  return str.join("\n\n");
}

function getCalls(api) {
  return Object.keys(api)
    .map(method => ({ method, calls: api[method].mock.calls }))
    .filter(({ calls }) => calls.length > 0);
}

function createMock() {
  const mocks = {
    create: jest.fn().mockReturnValue(Promise.resolve({ yo: 2 })),
    update: jest.fn().mockReturnValue(Promise.resolve()),
    get: jest.fn().mockReturnValue(Promise.resolve())
  };

  const airtable = () => mocks;

  return { mocks, airtable };
}

describe("records", () => {
  it("create issue", async () => {
    const { airtable, mocks } = createMock();
    await records.create(airtable, "Issues", getFix("issue").issue);

    // console.log(formatCalls(mocks));
    expect(formatCalls(mocks)).toMatchSnapshot();
  });

  it("update issue", async () => {
    const { airtable, mocks } = createMock();
    await records.update(airtable, "Issues", getFix("issue"));

    // console.log(formatCalls(mocks));
    expect(formatCalls(mocks)).toMatchSnapshot();
  });

  it("create pr", async () => {
    const { airtable, mocks } = createMock();
    await records.create(airtable, "Pulls", getFix("pr"));

    // console.log(formatCalls(mocks));
    expect(formatCalls(mocks)).toMatchSnapshot();
  });
});
