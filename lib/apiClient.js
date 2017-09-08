const https = require('https');
const greatCircle = require('great-circle');

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
            const distanceKm = greatCircle.distance(shelters[0].latitude, shelters[0].longitude, lat, lon);
            const distanceMi = Math.round(distanceKm / 1.609);

            apiaiResp.displayText =
              `The closest shelter is about ${distanceMi}mi away at ${shelters[0].shelter}.

              Address: ${shelters[0].address}, ${shelters[0].city}

              For more information about this shelter, call ${shelters[0].phone}.
              `;
              // TODO: Give people an option to see another shelter here.
              // "Would you like to see another shelter?"
              //
              // This would give the next result.
          } else {
            apiaiResp.displayText = `We couldn't find any open shelters close
              to you. You may want to check http://www.miamidade.gov/emergency/
              for the latest shelter information or call 2-1-1 or 3-1-1 for more info.`;
          }

          apiaiResp.speech = apiaiResp.displayText;

          resolve(JSON.stringify(apiaiResp));
        });
      });
    });
  }
}
