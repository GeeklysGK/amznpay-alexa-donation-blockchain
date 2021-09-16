'use strict';

function handleErrors(handlerInput) {
  const actionResponsePayloadCode = handlerInput.requestEnvelope.request.payload.errorCode;
  const actionResponsePayloadMessage = handlerInput.requestEnvelope.request.payload.errorMessage;
  console.log(Date.now(), 'AmazonPay:getErrorResponse:errorCode', actionResponsePayloadCode, actionResponsePayloadMessage);

  const actionResponseStatusMessage = handlerInput.requestEnvelope.request.status.message;
  let errorMessage = '';

  switch (actionResponseStatusMessage) {
    case 'PeriodicAmountExceeded':
      errorMessage = handlerInput.t('ERROR_PeriodicAmountExceeded');
      break;
    default:
      errorMessage = handlerInput.t('ERROR_GeneralConnection');
      break;
  }
  return { errorMessage: errorMessage };
}


function handleAuthorizationDeclines(authorizationStatusReasonCode, handlerInput) {
  const actionResponsePayload = handlerInput.requestEnvelope.request.payload;
  const authorizeDetails = actionResponsePayload.authorizationDetails;
  console.log(Date.now(), 'AmazonPay:getAuthorizeErrorResponse', authorizeDetails.authorizationStatus);
  let errorMessage = handlerInput.t('ERROR_GeneralConnection');
  return { errorMessage: errorMessage };
}

module.exports = {
  handleErrors: handleErrors,
  handleAuthorizationDeclines: handleAuthorizationDeclines,
};
