'use strict';

const { supportsAPL } = require('../util/helpers');
const { ACTION_ASK_FOR_DONATION_AMOUNT } = require('../util/actions');
const { SLOT_AMOUNT } = require('../util/constants');
const { askDonationAmountDirective } = require('../APL/directiveCreator');

function getResponse(handlerInput, speakOutput, reprompt, directive) {
    const responseBuilder = handlerInput.responseBuilder;

    // Alexa音声応答を設定
    responseBuilder.speak(speakOutput).reprompt(reprompt);

    if (supportsAPL(handlerInput)) {
        // デバイスがAPLをサポートしている場合
        responseBuilder.addDirective(directive);
    }

    return responseBuilder.getResponse();
}

// 寄付したい金額を尋ねる
function askForDonationAmountResponse(handlerInput) {
    const speakOutput = handlerInput.t('HOW_MUCH_DO_YOU_DONATE');
    const reprompt = speakOutput;
    const directive = askDonationAmountDirective(handlerInput, speakOutput);
    return getResponse(handlerInput, speakOutput, reprompt, directive);
}

// 金額をうまく聞き取れなかったケース
function askForCorrectDonationAmountResponse(handlerInput) {
    const speakOutput = handlerInput.t('ASK_FOR_AMOUNT_AGAIN');
    const reprompt = handlerInput.t('ASK_FOR_AMOUNT_AGAIN');
    const directive = askDonationAmountDirective(handlerInput, handlerInput.t('ASK_FOR_AMOUNT_AGAIN_HEADLINE'));
    return getResponse(handlerInput, speakOutput, reprompt, directive);
}

// 金額が過大過小の場合、もう一度ユーザに尋ねる
function askForValidDonationAmountResponse(handlerInput) {
    const speakOutput = handlerInput.t('AMOUNT_VALUE_ERROR');
    const reprompt = handlerInput.t('AMOUNT_VALUE_ERROR_REPROMPT');
    const directive = askDonationAmountDirective(handlerInput, handlerInput.t('AMOUNT_VALUE_ERROR_HEADLINE'));
    return getResponse(handlerInput, speakOutput, reprompt, directive);
}

module.exports = {
    askForDonationAmountResponse: askForDonationAmountResponse,
    askForCorrectDonationAmountResponse: askForCorrectDonationAmountResponse,
    askForValidDonationAmountResponse: askForValidDonationAmountResponse,
};
