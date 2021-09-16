'use strict';

const { supportsAPL } = require('../util/helpers');
const { ACTION_ASK_FOR_DONATION } = require('../util/actions');
const { skillLaunchDirective } = require('../APL/directiveCreator');

// スキルの起動
function skillLaunchResponse(handlerInput) {

    const responseBuilder = handlerInput.responseBuilder;

    // Alexa音声応答を設定
    const speakOutput = handlerInput.t('ASK_FOR_DONATION');
    const reprompt = handlerInput.t('ASK_FOR_DONATION_REPROMPT');
    responseBuilder.speak(speakOutput).reprompt(reprompt);

    if (supportsAPL(handlerInput)) {
        // デバイスがAPLをサポートしている場合
        responseBuilder.addDirective(skillLaunchDirective(handlerInput, speakOutput));
    }

    return responseBuilder.getResponse();
}

module.exports = {
    skillLaunchResponse: skillLaunchResponse,
};
