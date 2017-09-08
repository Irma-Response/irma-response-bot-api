const https = require('https');

const greatCircle = require('great-circle');

const API = {
  hostname: 'irma-api.herokuapp.com',
  port: 443,
};

module.exports = {
  sheltersByLatLon(lat, lon) {
    return new Promise((resolve, reject) => {
      const path = `/api/v1/shelters?lat=${lat}&lon=${lon}&accepting=true`;

      https.get(Object.assign({}, API, { path }), (res) => {
        res.on('error', (e) => { reject(e); });

        let respData = '';
        // eslint-disable-next-line
        res.on('data', chunk => respData += chunk);
        res.on('end', () => {
          const { shelters } = JSON.parse(respData);

          if (shelters.length > 0) {
            const distanceKm = greatCircle.distance(
              shelters[0].latitude,
              shelters[0].longitude,
              lat,
              lon
            );
            const distanceMi = Math.round(distanceKm / 1.609);
            shelters[0].distanceMi = distanceMi;

            resolve({ shelter: shelters[0] });
          } else {
            // could not find a nearby shelter
            resolve({ shelter: shelters[0] });
          }
        });
      });
    });
  },
};
