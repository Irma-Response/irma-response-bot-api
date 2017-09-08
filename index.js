const zipCodes = require('./lib/zipCodes.js');
const apiClient = require('./lib/apiClient.js');

exports.sheltersByZip = function sheltersByZip(req, res) {
  // sample post body from API.AI:
  // { id: '585f4b0f-01b7-463b-929b-c2fdaac3a92d', timestamp:
  // '2017-09-07T19:42:26.559Z', lang: 'en', result: { source: 'agent',
  // resolvedQuery: 'where is the nearest shelter?', speech: '', action:
  // 'lookup-shelter', actionIncomplete: true, parameters: { zip: '' },
  // contexts: [ [Object], [Object], [Object] ], metadata: { intentId:
  // '676cf61c-278f-47bc-919e-72b7e19470f4', webhookUsed: 'true',
  // webhookForSlotFillingUsed: 'true', intentName: 'where is the nearest
  // shelter' }, fulfillment: { speech: 'What zip code?', messages: [Object] },
  // score: 1 }, status: { code: 200, errorType: 'success' }, sessionId:
  // '28bc69a3-e6ca-4ab7-b2a7-c5277e2e57b1' }
  const zip = req.query.zip || (req.body.result &&
    req.body.result.parameters.zip);

  console.log('returning results for zip', zip);

  if (zip === undefined || zipCodes === undefined) {
    res.status(500).send('No zip given, or zip code geolocation data unavilable!');
  } else if (!(zip in zipCodes)) {
    res.status(404).send('Could not find ZIP code');
  } else {
    const [lat, lon] = zipCodes[zip];

    apiClient.sheltersByLatLon(lat, lon).then(data => {
      // TODO: Format this response in a way that makes sense for API.AI
      // (happening in apiClient right now, but broken)
      res.set('Content-Type', 'application/json');
      res.send(data);
      res.status(200).end();
    }).catch(e => {
      res.send(e.message);
      res.status(500).end();
    });;
  }
};
