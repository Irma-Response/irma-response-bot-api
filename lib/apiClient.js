const https = require('https');
const greatCircle = require('great-circle');

const API = {
  hostname: 'irma-api.herokuapp.com',
  port: 443,
}

module.exports = {
  sheltersByLatLon(lat, lon, Params) {
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

            if (Params.lang == 'es') {     // Espanol / Spanish
              apiaiResp.displayText = `Hay unos cuantos albergues en su área inmediato: ${shelters[0].shelter}.
                
Dirección: ${shelters[0].address}, ${shelters[0].city}
  
Para más información sobre esta llamada de refugio ${shelters[0].phone}.
                `;
              } else {  // lang = en by default
                apiaiResp.displayText = `The closest shelter is about ${distanceMi}mi away at ${shelters[0].shelter}.
    
Address: ${shelters[0].address}, ${shelters[0].city}.
    
For more information about this shelter, call ${shelters[0].phone}.
                  `;
              }
              // TODO: Give people an option to see another shelter here.
              // "Would you like to see another shelter?"
              //
              // This would give the next result.
          } else {
            if (Params.lang == 'es') {
              apiaiResp.displayText = `No pudimos encontrar ningún refugio abierto cerca de usted. Consulte IrmaResponse.org para obtener más información adicional o llame al 2-1-1 o 3-1-1.`;
            } else {
              apiaiResp.displayText = `We couldn't find any open shelters close to you. Check IrmaResponse.org for additional information or call 2-1-1 or 3-1-1.`;
            }
          }

          if (Params.lang == 'es') {     // Espanol / Spanish
            apiaiResp.displayText = apiaiResp.displayText + `Este servicio es automatizado. Si usted requiere primeros auxilios, llame al 9-1-1.

Si usted está en una zona de evacuación y no tiene transporte hacia un refugio, llame al 1-800-955-5504.

Si usted tiene problemas con ansiedad o angustia, enviar un texto al 741-741 día o noche para ponerse en contacto con un/a terapeuta profesional de crisis.`;
          } else {
          apiaiResp.displayText = apiaiResp.displayText + `This is an automated service. If you need emergency help, call 9-1-1

If you are in an evacuation zone and do not have transportation to a shelter, call 1-800-955-5504.
              
If you are having trouble with anxiety or emotional distress, text 741-741 day or night to connect with a professionally trained crisis counselor.`;
          }
          
          apiaiResp.speech = apiaiResp.displayText;

          resolve(JSON.stringify(apiaiResp));
        });
      });
    });
  }
}
