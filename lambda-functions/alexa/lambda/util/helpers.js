'use strict';

const Alexa = require('ask-sdk-core');

function generateRandomString(length) {
    let randomString = "";
    const stringValues = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++)
        randomString += stringValues.charAt(Math.floor(Math.random() * stringValues.length));

    return randomString;
}

function logTrace(handlerName, handlerInput) {
    if (handlerName === null || handlerName === undefined || handlerName.indexOf('canHandle') != -1) {
        return;
    }
    if (handlerInput !== null && handlerInput !== undefined &&
        handlerInput.requestEnvelope !== null && handlerInput.requestEnvelope !== undefined &&
        Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest') {
        console.log(handlerName, Alexa.getRequestType(handlerInput.requestEnvelope) + ',' + Alexa.getIntentName(handlerInput.requestEnvelope) + ',' + handlerInput.attributesManager.getSessionAttributes().USER_ACTION);
    }
    else {
        console.log(handlerName, Alexa.getRequestType(handlerInput.requestEnvelope) + ',' + handlerInput.attributesManager.getSessionAttributes().USER_ACTION);
    }
}

/* --------------------------------- 
   APLに関するhelpers
------------------------------------- */
function supportsAPL(handlerInput) {
    return handlerInput.requestEnvelope.context &&
        handlerInput.requestEnvelope.context.System &&
        handlerInput.requestEnvelope.context.System.device &&
        handlerInput.requestEnvelope.context.System.device.supportedInterfaces &&
        handlerInput.requestEnvelope.context.System.device.supportedInterfaces['Alexa.Presentation.APL'];
}

function renderDocumentDirective(token, document, datasources) {
    return {
        type: 'Alexa.Presentation.APL.RenderDocument',
        token: token,
        document: document,
        datasources: datasources
    };
}

/* --------------------------------- 
   Slotに関するhelpers
------------------------------------- */
function slotValueIsValidNumber(value) {
    return value !== null &&
        value !== undefined &&
        value !== '?' &&
        parseInt(value, 10) !== Number.Nan;
}

/* --------------------------------- 
   Sessionに関するhelpers
------------------------------------- */
function saveSessionAttr(handlerInput, attributes) {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    for (const [key, value] of Object.entries(attributes)) {
        sessionAttributes[key] = value;
    }
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
}

async function saveSessionAttrToPersistentAttr(handlerInput) {
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    handlerInput.attributesManager.setPersistentAttributes(attributes);
    await handlerInput.attributesManager.savePersistentAttributes();
}


async function savePersistentAttrToSessionAttr(handlerInput) {
    const attributes = await handlerInput.attributesManager.getPersistentAttributes();
    handlerInput.attributesManager.setSessionAttributes(attributes);
}

function clearSessionAttr(handlerInput) {
    handlerInput.attributesManager.setSessionAttributes({});
}

async function clearPersistentAttr(handlerInput) {
    handlerInput.attributesManager.setPersistentAttributes({});
    await handlerInput.attributesManager.savePersistentAttributes();
}

module.exports = {
    generateRandomString: generateRandomString,
    logTrace: logTrace,
    supportsAPL: supportsAPL,
    renderDocumentDirective: renderDocumentDirective,
    slotValueIsValidNumber: slotValueIsValidNumber,
    saveSessionAttr: saveSessionAttr,
    saveSessionAttrToPersistentAttr: saveSessionAttrToPersistentAttr,
    savePersistentAttrToSessionAttr: savePersistentAttrToSessionAttr,
    clearSessionAttr: clearSessionAttr,
    clearPersistentAttr: clearPersistentAttr
};
