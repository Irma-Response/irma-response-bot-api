const zipCodes = require('./lib/zipCodes.js');
const apiClient = require('./lib/apiClient.js');

exports.sheltersByZip = function helloWorld(req, res) {
  zip = req.body.result.parameters['zip'] || req.query[zip];
  if (zip === undefined || zipCodes === undefined) {
    res.status(500).send('No zip given, or zip code geolocation data unavilable!');
  } else {
    const [lat, lon] = zipCodes[zip];

    apiClient.sheltersByLatLon(lat, lon).then(data => {
      // TODO: Format this response in a way that makes sense for API.AI (happening in apiClient right now, but broken)
      res.send(data);
      res.status(200).end();
    }).catch(e => {
      res.send(e.message);
      res.status(500).end();
    });;
  }
};
