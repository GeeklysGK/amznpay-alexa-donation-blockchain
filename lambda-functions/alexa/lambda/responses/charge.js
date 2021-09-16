'use strict';

const { generateRandomString } = require('../util/helpers');
const { SLOT_AMOUNT } = require('../util/constants');
const { getChargeDirective } = require('../AmazonPay/directiveCreator');

// charge呼び出し
async function chargeDirective(handlerInput) {

    const responseBuilder = handlerInput.responseBuilder;

    // amountを取得
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const amount = attributes[SLOT_AMOUNT];

    // billingAgreementIdを取得
    const actionResponsePayload = handlerInput.requestEnvelope.request.payload;
    const billingAgreementDetails = actionResponsePayload.billingAgreementDetails;
    const billingAgreementId = billingAgreementDetails.billingAgreementId;

    // sellerのorderId及びauthorizationReferenceIdを生成
    const sellerOrderId = 'ORDER_' + generateRandomString(10);
    const authorizationReferenceId = 'AUTH_' + generateRandomString(10);

    // charge API呼び出し
    const payload = getChargeDirective(
        "charge",
        billingAgreementId,
        sellerOrderId,
        authorizationReferenceId,
        amount,
    );
    responseBuilder.addDirective(payload);

    // セッション終了処理
    responseBuilder.withShouldEndSession(true);

    return responseBuilder.getResponse();

}

module.exports = {
    chargeDirective: chargeDirective
};
