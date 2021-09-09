'use strict';

const AmazonPay = require('@amazonpay/amazon-pay-alexa-utils');
const { INIT, GLOBAL, REGIONAL } = require('./config');
const environment = process.env.ENVIRONMENT;

function getSetupDirective(token) {
    const payloadBuilder = AmazonPay.setupPayload(GLOBAL.version)
        .withSellerId(INIT.sellerId)
        .withCountryOfEstablishment(REGIONAL.countryOfEstablishment)
        .withLedgerCurrency(REGIONAL.ledgerCurrency)
        .withCheckoutLanguage(REGIONAL.checkoutLanguage)
        .withSellerNote(REGIONAL.sellerNote)
        .withStoreName(REGIONAL.sellerStoreName)
        .withCustomInformation(REGIONAL.customInformation)
        .shippingNeeded(GLOBAL.needAmazonShippingAddress);

    if (environment === 'SANDBOX') {
        payloadBuilder.onSandbox({
            eMail: INIT.sandboxCustomerEmailId
        });
    }

    return AmazonPay.setupDirective(payloadBuilder, token).build();
}

function getChargeDirective(token, billingAgreementId, sellerOrderId, authorizationReferenceId, amount) {
    const payloadBuilder = AmazonPay.chargePayload(GLOBAL.version)
        .withSellerId(INIT.sellerId)
        .withBillingAgreementId(billingAgreementId)
        .withPaymentAction(GLOBAL.paymentAction)
        .withAuthorizationReferenceId(authorizationReferenceId)
        .withAmount(amount)
        .withCurrency(REGIONAL.ledgerCurrency)
        .withTransactionTimeout(GLOBAL.transactionTimeout)
        .withSellerAuthorizationNote(REGIONAL.sellerAuthorizationNote)
        .withSoftDescriptor(REGIONAL.softDescriptor)
        .withSellerOrderId(sellerOrderId)
        .withStoreName(REGIONAL.sellerStoreName)
        .withCustomInformation(REGIONAL.customInformation)
        .withSellerNote(REGIONAL.sellerNote);

    return AmazonPay.chargeDirective(payloadBuilder, token).build();
}

module.exports = {
    getSetupDirective: getSetupDirective,
    getChargeDirective: getChargeDirective
};
