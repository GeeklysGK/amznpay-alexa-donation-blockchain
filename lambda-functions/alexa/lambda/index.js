'use strict';

const Alexa = require('ask-sdk-core');
const { DynamoDbPersistenceAdapter } = require('ask-sdk-dynamodb-persistence-adapter');
const interceptors = require('./interceptors');
const handlers = require('./handlers');
const tableName = process.env.DYNAMODB_PERSISTENCE_ADAPTER;
const dynamoDbPersistenceAdapter = new DynamoDbPersistenceAdapter({ tableName: tableName, createTable: true });

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        handlers.LaunchRequestHandler,
        handlers.PreviousIntentHandler,
        handlers.OrderCancelAndRefundIntentHandler,
        handlers.YesToDonateIntentHandler,
        handlers.DecideDonationAmountIntentHandler,
        handlers.AmountChangeIntentHandler,
        handlers.NoIntentHandler,
        handlers.DecideDonationAmountYesIntentHandler,
        handlers.DonationFinalConfirmationYesIntentHandler,
        handlers.ConnectionsSetupResponseHandler,
        handlers.ConnectionsChargeResponseHandler,
        handlers.HelpIntentHandler,
        handlers.CancelAndStopIntentHandler,
        handlers.SessionEndedRequestHandler,
        handlers.IntentReflectorHandler)
    .addErrorHandlers(
        handlers.ErrorHandler)
    .addRequestInterceptors(
        interceptors.LocalisationRequestInterceptor)
    .withPersistenceAdapter(dynamoDbPersistenceAdapter)
    .lambda();
