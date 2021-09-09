'use strict';

const { supportsAPL } = require('../util/helpers');
const { thankYouDirective } = require('../APL/directiveCreator');

// 寄付ありがとうございました
async function thankYouResponse(handlerInput) {

    const responseBuilder = handlerInput.responseBuilder;

    // 情報を取り出し
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const amount = sessionAttributes.AMOUNT;

    // Alexa音声応答を設定
    const speakOutput = handlerInput.t('THANK_YOU', { AMOUNT: amount });
    responseBuilder.speak(speakOutput);

    if (supportsAPL(handlerInput)) {
        // デバイスがAPLをサポートしている場合
        responseBuilder.addDirective(thankYouDirective(handlerInput, handlerInput.t('THANK_YOU_HEADLINE')));
    }

    // セッション終了処理
    responseBuilder.withShouldEndSession(true);

    return responseBuilder.getResponse();
}

module.exports = {
    thankYouResponse: thankYouResponse,
};
