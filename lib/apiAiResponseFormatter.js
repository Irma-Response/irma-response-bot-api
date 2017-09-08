const i18n = require('i18n');

const responseObject = text => (
  {
    speech: text,
    displayText: text,
    contextOut: [],
    data: {},
    source: 'irma-api',
  }
);

module.exports = {
  invalidZipCode() {
    return responseObject(i18n.__('error.zip.not_found'));
  },

  formatShelterMessage(shelter) {
    let respText;

    if (shelter) {
      // TODO: Give people an option to see another shelter here.
      // "Would you like to see another shelter?"
      //
      // This would give the next result.
      respText = i18n.__('shelter.closest', {
        distance: `${shelter.distanceMi}mi`,
        name: shelter.shelter,
        address: shelter.address,
        city: shelter.city,
        phone: shelter.phone,
      });
    } else {
      respText = i18n.__('shelter.none_found');
    }

    respText += '\n\n';
    respText += i18n.__('shelter.automated_disclaimer');

    return responseObject(respText);
  },
};
