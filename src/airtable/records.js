const { mappings } = require("../github");
const debug = require("debug")("devtools-bot");

async function get(airtable, table, ID) {
  try {
    const records = await airtable(table)
      .select({
        filterByFormula: `{ID} = ${ID}`,
        view: table
      })
      .all();

    if (records.length > 0) {
      debug(`Found record ${ID}`);
      return records[0].id;
    }
  } catch (e) {
    debug(`Did not find record ${ID}`);
    return null;
  }
}

async function getUserId(airtable, github, login) {
  try {
    const records = await airtable("Users")
      .select({
        filterByFormula: `{Login}="${login}"`,
        view: "Users"
      })
      .all();

    if (records.length > 0) {
      return records[0].id;
    } else {
      const payload = await github.users.getForUser({ username: login });
      if (payload && payload.data) {
        const user = mappings.mapUser(payload.data);
        const response = await airtable("Users").create(user);
        if (response && response.id) {
          debug(`Created user ${login}`);
          return response.id;
        }
      }
    }
  } catch (e) {
    debug(`failed to find user ${login} - ${e.message}`);
    return null;
  }
}

async function update(airtable, github, table, payload) {
  let record;
  let data;
  try {
    data = mappings.mapPayload(table, payload);
    if (data.Author) {
      const authorId = await getUserId(airtable, github, data.Author);
      data.Author = [authorId];
    }

    if (data.Assignees) {
      let assigneeIds = [];
      const assignees = data.Assignees;
      for (assignee of assignees) {
        const assigneeId = await getUserId(airtable, github, assignee);
        assigneeIds.push(assigneeId);
      }
      data.Assignees = assigneeIds.length > 0 ? assigneeIds : null;
    }

    const recordId = await get(airtable, table, data.ID);

    if (recordId) {
      debug(`Updating ${table} record ${data.ID}`);
      record = await airtable(table).update(recordId, data);
      return record;
    } else {
      debug(`Creating ${table} record ${data.ID}`);
      record = await airtable(table).create(data);
    }

    return record;
  } catch (e) {
    debug(`Failed to update ${table} record ${data && data.ID} - ${e.message}`);
    return null;
  }
}

async function create(airtable, table, payload) {
  let record;
  let data;
  try {
    data = mappings.mapPayload(table, payload);
    record = await airtable(table).create(data);
    return record;
  } catch (e) {
    debug(`Failed to create ${table} record ${data.ID} - ${e.message}`);
    return null;
  }
}

module.exports = { create, update, get, getUserId };
