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

async function getUser(airtable, login) {
  try {
    const records = await airtable("Users")
      .select({
        filterByFormula: `{Login}="${login}"`,
        view: "Users"
      })
      .all();

    if (records.length > 0) {
      return records[0].id;
    }
  } catch (e) {
    debug(`failed to find user ${login} - ${e.message}`);
    return null;
  }
}

async function update(airtable, table, payload) {
  let record;
  let data;
  try {
    data = mappings.mapPayload(table, payload);

    if (data.Author) {
      const authorId = await getUser(airtable, data.Author);
      data.Author = [authorId];
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
    debug(`Failed to update ${table} record ${data.ID} - ${e.message}`);
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

module.exports = { create, update, get, getUser };
