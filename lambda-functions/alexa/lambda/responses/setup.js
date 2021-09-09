'use strict';

const { getSetupDirective } = require('../AmazonPay/directiveCreator');

// setup API呼び出し
async function setupDirective(handlerInput) {
    const setupDirective = getSetupDirective("setup");
    return handlerInput.responseBuilder
        .addDirective(setupDirective)
        .withShouldEndSession(true)
        .getResponse();
}

module.exports = {
    setupDirective: setupDirective
};
