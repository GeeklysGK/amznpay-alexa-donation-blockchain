'use strict';

const { skillLaunchResponse } = require('./skillLaunch');
const { askForDonationAmountResponse, askForCorrectDonationAmountResponse, askForValidDonationAmountResponse } = require('./askForDonationAmount');
const { orderCancelAndRefundResponse } = require('./orderCancelAndRefund');
const { generalGuideResponse } = require('./generalGuide');
const { goodbyeResponse } = require('./goodbye');
const { confirmDonationResponse } = require('./confirmDonation');
const { setupDirective } = require('./setup');
const { chargeDirective } = require('./charge');
const { thankYouResponse } = require('./thankYou');
const { setupOrChargeErrorResponse, chargeDeclineResponse, genericErrorResponse } = require('./error');

module.exports = {
    skillLaunchResponse: skillLaunchResponse,
    askForDonationAmountResponse: askForDonationAmountResponse,
    askForCorrectDonationAmountResponse: askForCorrectDonationAmountResponse,
    askForValidDonationAmountResponse: askForValidDonationAmountResponse,
    orderCancelAndRefundResponse: orderCancelAndRefundResponse,
    generalGuideResponse: generalGuideResponse,
    goodbyeResponse: goodbyeResponse,
    confirmDonationResponse: confirmDonationResponse,
    setupDirective: setupDirective,
    chargeDirective: chargeDirective,
    thankYouResponse: thankYouResponse,
    setupOrChargeErrorResponse: setupOrChargeErrorResponse,
    chargeDeclineResponse: chargeDeclineResponse,
    genericErrorResponse: genericErrorResponse
};
