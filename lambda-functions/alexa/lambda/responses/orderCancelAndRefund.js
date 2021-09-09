'use strict';

const { supportsAPL } = require('../util/helpers');
const { orderCancelAndRefundDirective } = require('../APL/directiveCreator');

//寄付のキャンセルや返金
function orderCancelAndRefundResponse(handlerInput) {

    const responseBuilder = handlerInput.responseBuilder;

    // Alexa音声応答を設定
    const speakOutput = handlerInput.t('CAN_NOT_REFUND');
    responseBuilder.speak(speakOutput);

    // Alexaアプリにカード送付
    const cardTitle = handlerInput.t('CAN_NOT_REFUND_CARD_TITLE');
    const cardContent = handlerInput.t('CAN_NOT_REFUND_CARD_CONTENT');
    responseBuilder.withSimpleCard(cardTitle, cardContent);

    if (supportsAPL(handlerInput)) {
        // デバイスがAPLをサポートしている場合
        responseBuilder.addDirective(orderCancelAndRefundDirective(handlerInput, handlerInput.t('CAN_NOT_REFUND_HEADLINE')));
    }

    // セッション終了処理
    responseBuilder.withShouldEndSession(true);

    return responseBuilder.getResponse();
}

module.exports = {
    orderCancelAndRefundResponse: orderCancelAndRefundResponse,
};
