module.exports = {
  formatShelterMessage(shelter, lang) {
    const apiaiResp = {
      speech: '',
      displayText: '',
      contextOut: [],
      data: {},
      source: 'irma-api',
    };

    if (shelter) {
      // TODO: Give people an option to see another shelter here.
      // "Would you like to see another shelter?"
      //
      // This would give the next result.
      switch (lang) {
        case 'es':
          apiaiResp.displayText = `Hay unos cuantos albergues en su área inmediato: ${shelter.shelter}.

Dirección: ${shelter.address}, ${shelter.city}

Para más información sobre esta llamada de refugio ${shelter.phone}.`;
          break;
        default:
          apiaiResp.displayText = `The closest shelter is about ${shelter.distanceMi}mi away at ${shelter.shelter}.

Address: ${shelter.address}, ${shelter.city}.

For more information about this shelter, call ${shelter.phone}.`;
      }
    } else {
      switch (lang) {
        case 'es':
          apiaiResp.displayText = 'No pudimos encontrar ningún refugio abierto cerca de usted. Consulte IrmaResponse.org para obtener más información adicional o llame al 2-1-1 o 3-1-1.';
          break;
        default:
          apiaiResp.displayText = 'We couldn\'t find any open shelters close to you. Check IrmaResponse.org for additional information or call 2-1-1 or 3-1-1.';
      }
    }

    // Add another bit of response here.
    switch (lang) {
      case 'es':
        apiaiResp.displayText += `Este servicio es automatizado. Si usted requiere primeros auxilios, llame al 9-1-1.

Si usted está en una zona de evacuación y no tiene transporte hacia un refugio, llame al 1-800-955-5504.

Si usted tiene problemas con ansiedad o angustia, enviar un texto al 741-741 día o noche para ponerse en contacto con un/a terapeuta profesional de crisis.`;
        break;
      default:
        apiaiResp.displayText += `This is an automated service. If you need emergency help, call 9-1-1

If you are in an evacuation zone and do not have transportation to a shelter, call 1-800-955-5504.

If you are having trouble with anxiety or emotional distress, text 741-741 day or night to connect with a professionally trained crisis counselor.`;
    }

    apiaiResp.speech = apiaiResp.displayText;

    return apiaiResp;
  },
};
