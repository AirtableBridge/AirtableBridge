const _ = require("lodash");
const { authenticate, query } = require("../airtable");
const airtable = authenticate();
const dedent = require("dedent");
// const { getScreenshotsForPR } = require("../github/getPRScreenshots");
const cache = require("../utils/cache");
const ordinal = require("ordinal");
const dateNames = require("date-names");
async function getAuthor(recordId) {
  const record = await airtable("Users").find(recordId);
  return record.get("Login");
}

async function getPRs(options = {}) {
  const shouldCache = options.hasOwnProperty("cache") ? options.cache : false;
  if (shouldCache) {
    let prs = cache.get("last-week-prs");
    if (prs) {
      return prs;
    }
  }
  const records = await airtable("Pulls")
    .select({
      filterByFormula: "",
      view: "Last Week's PRs"
    })
    .all();

  let prs = records.map(r => r._rawJson.fields);
  prs = await mapPRs(prs);
  cache.write("last-week-prs", prs);
  return prs;
}

function attachmentTable(id, index) {
  return dedent`
    | .. |
    |--|
    | ![${id}-${index}] |
  `;
}

function createSection(prs, label) {
  const sectionPrs = prs.filter(pr => getLabel(pr) == label);
  const prList = sectionPrs.map(
    pr => `+ [${pr.Title}][${pr.ID}] [@${pr.Author}]`
  );
  const attachments = _.flatten(
    sectionPrs.map(pr =>
      pr.attachments.map((attachment, index) => attachmentTable(pr.ID, index))
    )
  );
  return dedent`
    ### ${label}

    ...

    ${prList.join("\n")}

    ${attachments.join("\n")}
  `;
}

function getLabel(pr) {
  return pr.Label2 || pr.Label;
}

function createSections(prs) {
  const labels = _.uniq(prs.map(getLabel));
  return labels.map(label => createSection(prs, label)).join("\n\n");
}

function getVariables(prs) {
  const prVars = prs.map(pr => `[${pr.ID}]: ${pr.Url}`);
  const authorVars = getAuthors(prs).map(
    author => `[@${author}]: https://github.com/${author}`
  );
  const screenShots = _.flatten(
    prs.map(pr =>
      pr.attachments.map(
        (attachment, index) => `[${pr.ID}-${index}]: ${attachment}`
      )
    )
  );

  return dedent`
    ${screenShots.join("\n")}
    ${prVars.join("\n")}
    ${authorVars.join("\n")}
  `;
}

function getAuthors(prs) {
  return _.uniq(prs.map(pr => pr.Author)).filter(
    author => !author.match(/greenkeeper/)
  );
}

function getHeader(prs) {
  const authors = getAuthors(prs).map(author => `[@${author}]`);
  const today = new Date();
  return dedent`
    ## <Title>

    ...

    ${authors.join(", ")}
  `;
}

async function mapPRs(prs) {
  return Promise.all(
    prs.map(async pr => {
      const attachments = []; //await getScreenshotsForPR(pr.ID);
      const author = await getAuthor(pr.Author[0]);
      return {
        ...pr,
        label: pr.Label2 || pr.Label,
        Author: author,
        attachments
      };
    })
  );
}

function post(prs) {
  const text = dedent`
    ${getHeader(prs)}

    ${createSections(prs)}

    ${getVariables(prs)}
  `;

  return text;
}

(async () => {
  process.on("unhandledRejection", (reason, p) => console.log(reason));

  let prs = await getPRs({ cache: true });
  console.log(prs[0]);
  // console.log(prs.map(pr => pr.attachments.length));
  // console.log(post(prs));
})();

module.exports = { post, getPRs };
