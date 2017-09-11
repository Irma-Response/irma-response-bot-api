const console = require('console');
const path = require('path');

const i18n = require('i18n');

const handleLookupShelter = require('./lib/handleLookupShelter');
const handleMoreShelters = require('./lib/handleMoreShelters');

i18n.configure({
  indent: '  ',
  locales: ['en', 'es'],
  objectNotation: true,
  directory: path.join(__dirname, '/locales'),
});

const extractContextParameter = (req, contextName, paramName) => {
  // developmet mode:
  //
  // curl "localhost:3000?context[theContextName][theParamName]=value"
  if (req.query && req.query.context && req.query.context[contextName]) {
    return req.query.context[contextName][paramName];
  }

  // production mode:
  if (!req.body || !req.body.result) {
    return null;
  } else {
    const context = req.body.result.contexts.find(context => context.name == contextName);
    if (context) {
      return context.parameters[paramName];
    } else {
      return null;
    }
  }
};

exports.sheltersByZip = function sheltersByZip(req, res) {
  let parsedRequest;

  if (req.query.testAction) {
    // development mode
    switch (req.query.testAction) {
      case 'lookup-shelter':
        parsedRequest = { method: handleLookupShelter, params: req.query };
        break;
      case 'lookup-shelter-more':
        parsedRequest = { method: handleMoreShelters, params: req.query };
        break;
    };

  } else if (req.body && req.body.result) {
    // production mode
    switch (req.body.result.action) {
      case 'lookup-shelter':
        parsedRequest = {
          method: handleLookupShelter,
          params: {
            zip: req.body.result.parameters.zip,
            lang: req.body.result.parameters.lang || 'en',
            shownShelterIds: extractContextParameter(req, 'shownshelterids', 'shownShelterIds') || [],
          },
        };
        break;
      case 'lookup-shelter-more':
        parsedRequest = {
          method: handleMoreShelters,
          params: {
            zip: extractContextParameter(req, 'individualneedsshelter-followup', 'zip'),
            lang: extractContextParameter(req, 'individualneedsshelter-followup', 'lang') || 'en',
            shownShelterIds: extractContextParameter(req, 'shownshelterids', 'shownShelterIds') || [],
          },
        };
        break;
    }
  } else {
    res.status(400)
    res.send('Invalid request').end();
    return;
  }

  const method = parsedRequest.method;
  console.log('params', parsedRequest.params);
  method(parsedRequest.params)
    .then(({ headers, status, body }) => {
      res.set(headers);
      res.status(status);
      res.send(body).end();
    })
    .catch((error) => {
      console.error(error);
      res.status(500);
      res.send(error.toString()).end();
    })
};
