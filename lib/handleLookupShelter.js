const console = require('console');

const i18n = require('i18n');

const apiAiResponseFormatter = require('./apiAiResponseFormatter');
const apiClient = require('./apiClient');
const zipCodes = require('./zipCodes');

module.exports = ({ zip, lang, shownShelterIds }) => {
  return new Promise((resolve, reject) => {
    if (!zip) {
      resolve({
        headers: { 'Content-Type': 'application/json' },
        status: 400,
        body: JSON.stringify(
          { error: i18n.__('No zip given, or bad geolocation data.') }
        ),
      });
    } else if (!(zip in zipCodes)) {
      resolve({
        headers: { 'Content-Type': 'application/json' },
        status: 200,
        body: JSON.stringify(apiAiResponseFormatter.invalidZipCode()),
      });
    } else {
      // lookin' good, let's keep going.
      console.log('returning results for zip', zip, ', language: ', lang);

      i18n.setLocale(lang);

      const [lat, lon] = zipCodes[zip];

      apiClient
        .closestShelterToLatLon(lat, lon)
        .then(({ shelter, distanceMi, numMoreWithinTenMi }) => {
          resolve({
            headers: { 'Content-Type': 'application/json' },
            status: 200,
            body: JSON.stringify(
              apiAiResponseFormatter.formatShelterMessage(
                shelter,
                distanceMi,
                numMoreWithinTenMi,
                shownShelterIds,
                [lat, lon]
              )
            ),
          })
        })
        .catch((e) => {
          reject(e);
        });
    }
  });
};
