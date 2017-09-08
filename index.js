const path = require('path');

const i18n = require('i18n');

const apiAiResponseFormatter = require('./lib/apiAiResponseFormatter');
const apiClient = require('./lib/apiClient.js');
const parseApiAiBody = require('./lib/parseApiAiBody');
const zipCodes = require('./lib/zipCodes.js');

i18n.configure({
  indent: '  ',
  locales: ['en', 'es'],
  objectNotation: true,
  directory: path.join(__dirname, '/locales'),
});

exports.sheltersByZip = function sheltersByZip(req, res) {
  const parsedRequest = parseApiAiBody(req.body);
  const zip = req.query.zip || parsedRequest.zip;
  const lang = parsedRequest.lang || req.query.lang || 'en';

  i18n.setLocale(lang);

  // eslint-disable-next-line
  console.log('returning results for zip', zip, ', language: ', lang);

  if (zip === undefined || zipCodes === undefined) {
    res.status(500).send('No zip given, or zip code geolocation data unavilable!');
  } else if (!(zip in zipCodes)) {
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify(apiAiResponseFormatter.invalidZipCode()));
    res.status(200).end();
  } else {
    const [lat, lon] = zipCodes[zip];

    apiClient.sheltersByLatLon(lat, lon).then(({ shelter }) => {
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify(apiAiResponseFormatter.formatShelterMessage(shelter)));
      res.status(200).end();
    }).catch((e) => {
      res.send(e.message);
      res.status(500).end();
    });
  }
};
