const fs = require("fs");

module.exports = (path) => {
  const res_array = [];

  const res = fs.readFileSync(path, "utf-8");

  res.split(/\r?\n/).forEach(function (line) {
    res_array.push(line);
  });

  return res_array;
};
