const https = require('https');

const API = {
  hostname: 'irma-api.herokuapp.com',
  port: 443,
}

module.exports = {
  sheltersByLatLon(lat, lon) {
    return new Promise((resolve, reject) => {
      const path = `/api/v1/shelters?lat=${lat}&lon=${lon}&accepting=true`;

      https.get(Object.assign({}, API, { path }), res => {
        res.on('error', (e) => { reject(e); });

        let respData = '';
        res.on('data', chunk => respData += chunk);
        res.on('end', () => {
          apiaiResp = {
            speech: "",
            displayText: "",
            contextOut: [],
            data: {},
            source: "irma-api",
          }

          const shelters = JSON.parse(respData).shelters;
          
          if (shelters.length > 0) {
            // TODO: Provide a better response here
            apiaiResp.displayText = `The closest shelter is: ${shelters[0].shelter}`;
          } else {
            apiaiResp.displayText = `We couldn't find any shelters close to you.`;
          }

          apiaiResp.speech = apiaiResp.displayText;

          resolve(JSON.stringify(apiaiResp));
        });
      });
    });
  }
}
