'use strict';

const constants = require('../util/constants');
const { renderDocumentDirective } = require('../util/helpers');
const headline = require('./headline.json');
const headlineDataSource = require('./headlineData.json');

function skillLaunchDirective(handlerInput, bodyText) {
    const headlineData = JSON.parse(JSON.stringify(headlineDataSource));

    // 画像設定
    headlineData.headlineTemplateData.properties.backgroundImage.sources[0].url = constants.BACKGROUND_IMAGE_URL;

    // テキスト設定
    const displayText = bodyText.replace(/\n/g, '<br>');
    headlineData.headlineTemplateData.properties.textContent.primaryText.text = displayText;
    headlineData.headlineTemplateData.properties.hintText = handlerInput.t('HINT_YES_NO');

    return renderDocumentDirective(constants.TOKEN_SKILL_LAUNCH, headline, headlineData);
}

function askDonationAmountDirective(handlerInput, bodyText) {
    const headlineData = JSON.parse(JSON.stringify(headlineDataSource));

    // 画像設定
    headlineData.headlineTemplateData.properties.backgroundImage.sources[0].url = constants.HOW_MUCH_IMAGE_URL;

    // テキスト設定
    const displayText = bodyText.replace(/\n/g, '<br>');
    headlineData.headlineTemplateData.properties.textContent.primaryText.text = displayText;
    headlineData.headlineTemplateData.properties.hintText = handlerInput.t('HINT_AMOUNT');

    return renderDocumentDirective(constants.TOKEN_DECIDE_DONATION_AMOUNT, headline, headlineData);
}

function confirmDonationDirective(handlerInput, bodyText) {
    const headlineData = JSON.parse(JSON.stringify(headlineDataSource));

    // 画像設定
    headlineData.headlineTemplateData.properties.backgroundImage.sources[0].url = constants.CONFIRM_IMAGE_URL;

    // テキスト設定
    const displayText = bodyText.replace(/\n/g, '<br>');
    headlineData.headlineTemplateData.properties.textContent.primaryText.text = displayText;
    headlineData.headlineTemplateData.properties.hintText = handlerInput.t('HINT_YES_NO');

    return renderDocumentDirective(constants.TOKEN_DONATION_FINAL_CONFIRMATION, headline, headlineData);
}

function orderCancelAndRefundDirective(handlerInput, bodyText) {
    const headlineData = JSON.parse(JSON.stringify(headlineDataSource));

    // 画像設定
    headlineData.headlineTemplateData.properties.backgroundImage.sources[0].url = constants.CS_IMAGE_URL;

    // テキスト設定
    const displayText = bodyText.replace(/\n/g, '<br>');
    headlineData.headlineTemplateData.properties.textContent.primaryText.text = displayText;
    headlineData.headlineTemplateData.properties.hintText = handlerInput.t('HINT_CARD');

    return renderDocumentDirective(constants.TOKEN_ORDER_CANCEL_AND_REFUND, headline, headlineData);
}

function goodbyeDirective(handlerInput, bodyText) {
    const headlineData = JSON.parse(JSON.stringify(headlineDataSource));

    // 画像設定
    headlineData.headlineTemplateData.properties.backgroundImage.sources[0].url = constants.GOODBYE_IMAGE_URL;

    // テキスト設定
    const displayText = bodyText.replace(/\n/g, '<br>');
    headlineData.headlineTemplateData.properties.textContent.primaryText.text = displayText;

    return renderDocumentDirective(constants.TOKEN_GOODBYE, headline, headlineData);
}

function thankYouDirective(handlerInput, bodyText) {
    const headlineData = JSON.parse(JSON.stringify(headlineDataSource));

    // 画像設定
    headlineData.headlineTemplateData.properties.backgroundImage.sources[0].url = constants.THANK_YOU_IMAGE_URL;

    // テキスト設定
    const displayText = bodyText.replace(/\n/g, '<br>');
    headlineData.headlineTemplateData.properties.textContent.primaryText.text = displayText;

    return renderDocumentDirective(constants.TOKEN_THANK_YOU, headline, headlineData);
}

function guideDirective(handlerInput, bodyText) {
    const headlineData = JSON.parse(JSON.stringify(headlineDataSource));

    // 画像設定
    headlineData.headlineTemplateData.properties.backgroundImage.sources[0].url = constants.HELP_IMAGE_URL;

    // テキスト設定
    const displayText = bodyText.replace(/\n/g, '<br>');
    headlineData.headlineTemplateData.properties.textContent.primaryText.text = displayText;

    return renderDocumentDirective(constants.TOKEN_GUIDANCE, headline, headlineData);
}

function errorDirective(handlerInput, bodyText) {
    const headlineData = JSON.parse(JSON.stringify(headlineDataSource));

    // 画像設定
    headlineData.headlineTemplateData.properties.backgroundImage.sources[0].url = constants.ERROR_IMAGE_URL;

    // テキスト設定
    const displayText = bodyText.replace(/\n/g, '<br>');
    headlineData.headlineTemplateData.properties.textContent.primaryText.text = displayText;

    return renderDocumentDirective(constants.TOKEN_ERROR, headline, headlineData);
}

module.exports = {
    skillLaunchDirective: skillLaunchDirective,
    askDonationAmountDirective: askDonationAmountDirective,
    confirmDonationDirective: confirmDonationDirective,
    orderCancelAndRefundDirective: orderCancelAndRefundDirective,
    goodbyeDirective: goodbyeDirective,
    thankYouDirective: thankYouDirective,
    guideDirective: guideDirective,
    errorDirective: errorDirective
};
