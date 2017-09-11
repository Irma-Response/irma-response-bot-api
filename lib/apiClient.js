const https = require('https');

const greatCircle = require('great-circle');

const API = {
  hostname: 'irma-api.herokuapp.com',
  port: 443,
};

const shelterDistance = (lat, lon, shelter) => (
  greatCircle.distance(
    shelter.latitude,
    shelter.longitude,
    lat,
    lon
  )
);

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

          // sort shelters so the closer ones come first
          shelters.sort((a, b) => shelterDistance(lat, lon, a) < shelterDistance(lat, lon, b) ? -1 : 1);

          if (shelters.length > 0) {
            resolve({ shelters });
          } else {
            // no nearby shelters
            resolve({ shelters: [] });
          }
        });
      });
    });
  },

  closestShelterToLatLon(lat, lon) {
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
            const distanceKm = shelterDistance(lat, lon, shelters[0]);
            const distanceMi = Math.round(distanceKm / 1.609);

            // 10 mi = 16.09 km
            // subtract one so as to not double-count `shelters[0]`
            const numMoreWithinTenMi = shelters.filter(shelter => shelterDistance(lat, lon, shelter) < 16.09).length - 1;

            resolve({ shelter: shelters[0], distanceMi, numMoreWithinTenMi });
          } else {
            // could not find a nearby shelter
            resolve({ shelter: null, distanceMi: null });
          }
        });
      });
    });
  },
};
