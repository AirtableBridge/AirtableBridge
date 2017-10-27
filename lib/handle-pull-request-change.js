const { mapPR } = require("./github/mappings")
const {authenticate, findRecord} = require("./airtable/utils")

module.exports = handlePullRequestChange
const airtable = authenticate();

async function createPR(pr) {
  return new Promise(resolve => {
    const data = mapPR(pr);
    airtable("Pulls").create(data, function(err, record) {
      if (err) {
        console.log(`Error: ${err.message}`);
        resolve(false);
        return;
      }
      resolve(true);
      console.log(`Created ${data.Title} ${record.getId()}`);
    });
  });
}

async function updatePR(id, pr) {
  console.log(`Updating PR ${id}`)
  const record = await findRecord({table: "Pulls", view: "Pulls"}, id)
  const recordFields = mapPR(pr)
  console.log(`Found record ${record} -- ${JSON.stringify(record)}`)
  
    airtable("Pulls").update(
      record.id,
      recordFields,
      function(err, record) {
        if (err) {
          console.error(`Error updating record: ${err}`);
          return;
        }
        console.log(`Updated: ${id} - ${record.get("Title")}`);
      }
  );
  
}



async function handlePullRequestChange (robot, context) {
  const api = context.github
  const title = context.payload.pull_request.title;
  
  const { action, number, pull_request } = context.payload;
  console.log(context.id, title, action, number)

  if (action == "opened") {
    return createPR(pull_request)
  }
  
  updatePR(number, pull_request)
  
}
