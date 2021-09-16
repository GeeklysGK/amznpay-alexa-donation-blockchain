'use strict';

const { supportsAPL } = require('../util/helpers');
const { goodbyeDirective } = require('../APL/directiveCreator');

async function goodbyeResponse(handlerInput) {

    const responseBuilder = handlerInput.responseBuilder;

    // Alexa音声応答を設定
    const speakOutput = handlerInput.t('GOODBYE');
    responseBuilder.speak(speakOutput);

    if (supportsAPL(handlerInput)) {
        // デバイスがAPLをサポートしている場合
        responseBuilder.addDirective(goodbyeDirective(handlerInput, speakOutput));
    }

    // セッション終了処理
    responseBuilder.withShouldEndSession(true);

    return responseBuilder.getResponse();
}

module.exports = {
    goodbyeResponse: goodbyeResponse,
};
