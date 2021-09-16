'use strict';

const helpers = require('../util/helpers');
const { guideDirective } = require('../APL/directiveCreator');

// ヘルプ：案内
function generalGuideResponse(handlerInput) {

    const responseBuilder = handlerInput.responseBuilder;

    // Alexa音声応答を設定
    const speakOutput = handlerInput.t('GENERAL_GUIDE');
    const reprompt = handlerInput.t('GENERAL_GUIDE');
    responseBuilder.speak(speakOutput).reprompt(reprompt);

    if (helpers.supportsAPL(handlerInput)) {
        // デバイスがAPLをサポートしている場合
        responseBuilder.addDirective(guideDirective(handlerInput, handlerInput.t('GENERAL_GUIDE_HEADLINE')));
    }
    return responseBuilder.getResponse();
}

module.exports = {
    generalGuideResponse: generalGuideResponse,
};
