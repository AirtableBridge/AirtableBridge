const fs = require("fs");
const path = require("path");

function getPath(id) {
  return path.join(__dirname, "../../data", `${id}.json`);
}

function get(id) {
  if (!fs.existsSync(getPath(id))) {
    return;
  }

  const text = fs.readFileSync(getPath(id));

  return JSON.parse(text);
}

function write(id, data) {
  const text = JSON.stringify(data, null, 2);
  fs.writeFileSync(getPath(id), text);
}

module.exports = { get, write };

// (function() {
//   write("foo", { a: 2 });
//   const data = get("foo");
//   console.log(data);
// })();
