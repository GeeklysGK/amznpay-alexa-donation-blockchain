'use strict';

const { supportsAPL } = require('../util/helpers');
const { ACTION_DONATION_FINAL_CONFIRMATION } = require('../util/actions');
const { confirmDonationDirective } = require('../APL/directiveCreator');

// 寄付の最終確認
async function confirmDonationResponse(handlerInput) {

    // 情報を取り出し
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const amount = sessionAttributes.AMOUNT;

    const responseBuilder = handlerInput.responseBuilder;

    // Alexa音声応答を設定
    const speakOutput = handlerInput.t('CONFIRM_DONATION_AMOUNT', { AMOUNT: amount });
    const reprompt = handlerInput.t('CONFIRM_DONATION_AMOUNT_REPROMPT', { AMOUNT: amount });
    responseBuilder.speak(speakOutput).reprompt(reprompt);

    if (supportsAPL(handlerInput)) {
        // デバイスがAPLをサポートしている場合
        responseBuilder.addDirective(confirmDonationDirective(handlerInput, speakOutput));
    }

    return responseBuilder.getResponse();
}

module.exports = {
    confirmDonationResponse: confirmDonationResponse,
};
