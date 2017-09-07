const fs = require('fs');
const path = require('path');

const csvparse = require('csv-parse/lib/sync');

const ZIP_CODES = fs.readFileSync(path.resolve(__dirname, '../data/zipcodes.csv'));

const latLongByZIP = {};

csvparse(ZIP_CODES, { delimiter: "\t" }).forEach(function(el) {
  const zip = el[1];
  const latitude = el[9];
  const longitude = el[10];

  latLongByZIP[zip] = [latitude, longitude];
});

module.exports = latLongByZIP;
