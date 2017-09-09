// sample post body from API.AI:
// {
//   id: '585f4b0f-01b7-463b-929b-c2fdaac3a92d',
//   timestamp: '2017-09-07T19:42:26.559Z',
//   lang: 'en',
//   result: {
//     source: 'agent',
//       resolvedQuery: 'where is the nearest shelter?',
//       speech: '',
//       action: 'lookup-shelter',
//       actionIncomplete: true,
//       parameters: {
//         zip: '33144'
//       },
//       contexts: [ [Object], [Object], [Object] ],
//       metadata: {
//         intentId: '676cf61c-278f-47bc-919e-72b7e19470f4',
//         webhookUsed: 'true',
//         webhookForSlotFillingUsed: 'true',
//         intentName: 'where is the nearest shelter'
//       },
//       fulfillment: {
//         speech: 'What zip code?',
//         messages: [Object]
//       },
//       score: 1
//   },
//   status: {
//     code: 200,
//     errorType: 'success'
//   },
//   sessionId: '28bc69a3-e6ca-4ab7-b2a7-c5277e2e57b1'
// }

// TODO: be able to handle a request for different chatbot actions.
module.exports = (body) => {
  // sanity check the input
  if (!body || !body.result) {
    return {};
  }

  return {
    zip: body.result.parameters.zip,
    lang: body.result.parameters.lang,
  };
};
