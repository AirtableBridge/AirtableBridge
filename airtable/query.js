module.exports = async function query(airtable, data) {
  return new Promise(async (resolve, reject) => {
    let records = [];
    function page(records, fetchNextPage) {
      records.forEach(onRecord);
      fetchNextPage();
    }

    function done(err) {
      if (err) {
        console.error(err);
        reject([]);
      }
      resolve(records);
    }

    function onRecord(record) {
      records.push(record);
    }

    const results = await airtable(data.table).select({
      maxRecords: 100,
      filterByFormula: data.formula,
      view: data.view
    });

    results.eachPage(page, done);
  });
};
