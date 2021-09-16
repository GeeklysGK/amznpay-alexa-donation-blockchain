'use strict';

const { supportsAPL } = require('../util/helpers');
const errorHandler = require("../AmazonPay/errorHandler");
const { errorDirective } = require('../APL/directiveCreator');

// setup and charge APIのエラーハンドリング
async function setupOrChargeErrorResponse(handlerInput) {

    const result = errorHandler.handleErrors(handlerInput);

    const responseBuilder = handlerInput.responseBuilder;

    // Alexa音声応答を設定
    const speakOutput = result.errorMessage + '\n' + handlerInput.t('GOODBYE');
    responseBuilder.speak(speakOutput);

    if (supportsAPL(handlerInput)) {
        // デバイスが APLをサポートしている場合
        responseBuilder.addDirective(errorDirective(handlerInput, handlerInput.t('GOODBYE')));
    }

    // session終了
    responseBuilder.withShouldEndSession(true);

    return responseBuilder.getResponse();
}

// charge declineのエラーハンドリング
async function chargeDeclineResponse(handlerInput) {
    // authorizationDetailsから、stateを取得
    const actionResponsePayload = handlerInput.requestEnvelope.request.payload;
    const authorizationStatusState = actionResponsePayload.authorizationDetails.authorizationStatus.state;
    const authorizationStatusReasonCode = actionResponsePayload.authorizationDetails.authorizationStatus.reasonCode;
    console.log('authorizationStatusState:' + authorizationStatusState);
    console.log('authorizationStatusReasonCode' + authorizationStatusReasonCode);

    // charge APIのdeclineハンドリング
    const result = errorHandler.handleAuthorizationDeclines(authorizationStatusReasonCode, handlerInput);

    const responseBuilder = handlerInput.responseBuilder;

    // Alexa音声応答を設定
    const speakOutput = result.errorMessage + '\n' + handlerInput.t('GOODBYE');
    responseBuilder.speak(speakOutput);

    if (supportsAPL(handlerInput)) {
        // デバイスが APLをサポートしている場合
        responseBuilder.addDirective(errorDirective(handlerInput, handlerInput.t('GOODBYE')));
    }

    // session終了
    responseBuilder.withShouldEndSession(true);

    return responseBuilder.getResponse();
}


// 一般的なエラー：セッション中断しない
function genericErrorResponse(handlerInput) {

    const responseBuilder = handlerInput.responseBuilder;

    // Alexa音声応答を設定
    const speakOutput = handlerInput.t('ERROR');
    const reprompt = handlerInput.t('ERROR');
    responseBuilder.speak(speakOutput).reprompt(reprompt);

    if (supportsAPL(handlerInput)) {
        // デバイスが APLをサポートしている場合
        responseBuilder.addDirective(errorDirective(handlerInput, handlerInput.t('ERROR_HEADLINE')));
    }

    return responseBuilder.getResponse();
}

module.exports = {
    setupOrChargeErrorResponse: setupOrChargeErrorResponse,
    chargeDeclineResponse: chargeDeclineResponse,
    genericErrorResponse: genericErrorResponse
};
