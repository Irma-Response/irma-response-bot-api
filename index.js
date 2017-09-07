const zipCodes = require('./lib/zipCodes.js');
const apiClient = require('./lib/apiClient.js');

exports.sheltersByZip = function helloWorld(req, res) {
  if (req.body.zip === undefined && req.query.zip === undefined) {
    res.status(404).send('No zip given!');
  } else {
    const [lat, lon] = zipCodes[req.body.zip || req.query.zip];

    apiClient.sheltersByLatLon(lat, lon).then(data => {
      // TODO: Format this response in a way that makes sense for API.AI
      res.send(data);
      res.status(200).end();
    }).catch(e => {
      res.send(e.message);
      res.status(500).end();
    });;
  }
};
