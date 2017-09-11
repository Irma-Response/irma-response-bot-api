const i18n = require('i18n');

const apiAiResponseFormatter = require('./apiAiResponseFormatter');
const apiClient = require('./apiClient');
const zipCodes = require('./zipCodes');

/*
 * Tell the user about other shelters near that ZIP.
 *
 * Anything in the `shownShelterIds` array should be filtered
 * out, because those shelters have already been shown.
 */
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
      const [lat, lon] = zipCodes[zip];

      apiClient
        .sheltersByLatLon(lat, lon)
        .then(({ shelters }) => {
          resolve({
            headers: { 'Content-Type': 'application/json' },
            status: 200,
            body: JSON.stringify(
              apiAiResponseFormatter.formatMoreSheltersMessage(
                shelters,
                shownShelterIds
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
