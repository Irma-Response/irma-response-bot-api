const https = require('https');

const API = {
  hostname: 'irma-api.herokuapp.com',
  port: 443,
}

module.exports = {
  sheltersByLatLon(lat, lon) {
    return new Promise((resolve, reject) => {
      const path = `/api/v1/shelters?lat=${lat}&lon=${lon}`;

      https.get(Object.assign({}, API, { path }), res => {
        res.on('error', (e) => { reject(e); });

        let respData = '';
        res.on('data', chunk => respData += chunk);
        res.on('end', () => {
          resolve(JSON.parse(respData).shelters);
        });
      });
    });
  }
}
