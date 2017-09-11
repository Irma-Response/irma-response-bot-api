const i18n = require('i18n');

const contextOut = (shownShelterIds) => (
  shownShelterIds.length ?
    [
      {
        name: "shownshelterids",
        lifespan: 2,
        parameters: {
          shownShelterIds
        },
      }
    ] : []
);

const responseObject = (text, shownShelterIds = []) => (
  {
    speech: text,
    displayText: text,
    contextOut: contextOut(shownShelterIds),
    data: {},
    source: 'irma-api',
  }
);

module.exports = {
  invalidZipCode() {
    return responseObject(i18n.__('error.zip.not_found'));
  },

  formatShelterMessage(shelter, distanceMi, numMoreWithinTenMi) {
    let respText;
    let shownShelterIds = [];

    if (shelter) {
      // TODO: Give people an option to see another shelter here.
      // "Would you like to see another shelter?"
      //
      // This would give the next result.
      const distance = distanceMi < 1 ? i18n.__('less than a mile') : `${distanceMi} miles`;
      const more = numMoreWithinTenMi > 0 ? i18n.__('shelter.closest_more', { numMore: numMoreWithinTenMi }) : '';

      shownShelterIds.push(shelter.id);

      respText = i18n.__('shelter.closest', {
        distance,
        shelter: i18n.__('shelter.shelter', {
          name: shelter.shelter,
          address: shelter.address,
          phone: shelter.phone
        }),
        city: shelter.city,
        more,
      });
    } else {
      respText = i18n.__('shelter.none_found');
    }

    respText += i18n.__('shelter.automated_disclaimer');

    return responseObject(respText, shownShelterIds);
  },

  formatMoreSheltersMessage(shelters, shownShelterIds) {
    const filteredShelters = shelters.filter(shelter => (
      shownShelterIds.indexOf(shelter.id) === -1 &&
        shownShelterIds.indexOf(shelter.id.toString()) === -1
    ));
    const numSheltersToShow = Math.min(filteredShelters.length, 3);
    const numSheltersRemaining = filteredShelters.length - numSheltersToShow;
    let more = '';

    if (numSheltersRemaining > 0) {
      more = i18n.__('shelter.closest_more', { more: numSheltersRemaining });
    } else {
      return responseObject(i18n.__('shelter.no_more_shelters'), shownShelterIds);
    }

    const sheltersToShow = filteredShelters.slice(0, numSheltersToShow);
    sheltersToShow.forEach(shelter => shownShelterIds.push(shelter.id));

    const respText = i18n.__('shelter.closest_next_page', {
      num: sheltersToShow.length,
      shelters: sheltersToShow.map(shelter =>
        i18n.__('shelter.shelter', {
          name: shelter.shelter,
          address: shelter.address,
          phone: shelter.phone
        })
      ).join("\n\n"),
      more,
    });

    return responseObject(respText, shownShelterIds);
  },
};
