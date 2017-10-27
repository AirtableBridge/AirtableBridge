function createIssue(robot, context) {
  const record = getRecordFields(context.payload);
  base("Issues").create(record, function(err, record) {
    if (err) {
      console.error(err);
      return;
    }
    console.log(record.getId());
  });
}

async function updateIssue(robot, context) {
  const { issue: { number } } = context.payload;
  const record = await findRecord(number);
  const recordFields = getRecordFields(context.payload);

  base("Issues").update(record.id, recordFields, function(err, record) {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`Updated: ${number} - ${record.get("Title")}`);
  });
}

module.exports = { createIssue, updateIssue };
