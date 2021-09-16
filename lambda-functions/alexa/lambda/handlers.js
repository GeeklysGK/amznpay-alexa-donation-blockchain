'use strict';

const Alexa = require('ask-sdk-core');
const actions = require('./util/actions');
const constants = require('./util/constants');
const helpers = require('./util/helpers');
const responses = require('./responses');

/* --------------------------------- 
   スキル起動
------------------------------------- */
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    helpers.logTrace('LaunchRequestHandler.canHandle', handlerInput);
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  async handle(handlerInput) {
    helpers.logTrace('LaunchRequestHandler.handle', handlerInput);

    // セッションへの保存
    helpers.saveSessionAttr(handlerInput, {
      USER_ACTION: actions.ACTION_ASK_FOR_DONATION
    });

    //スキルローンチレスポンス
    return responses.skillLaunchResponse(handlerInput);
  }
};

/* --------------------------------- 
   寄付
------------------------------------- */
// 「寄付しますか」に対して「はい」と回答
const YesToDonateIntentHandler = {
  canHandle(handlerInput) {
    helpers.logTrace('YesToDonateIntentHandler.canHandle', handlerInput);
    const requestEnvelope = handlerInput.requestEnvelope;
    return handlerInput.attributesManager.getSessionAttributes().USER_ACTION === actions.ACTION_ASK_FOR_DONATION &&
      Alexa.getRequestType(requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(requestEnvelope) === 'AMAZON.YesIntent';
  },
  async handle(handlerInput) {
    helpers.logTrace('YesToDonateIntentHandler.handle', handlerInput);
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    // 金額揃えた場合、寄付の最終確認
    if (sessionAttributes.AMOUNT) {
      helpers.saveSessionAttr(handlerInput, { USER_ACTION: actions.ACTION_DONATION_FINAL_CONFIRMATION });
      return await responses.confirmDonationResponse(handlerInput);
    }

    // 金額がわからない場合、寄付金額を聞く
    helpers.saveSessionAttr(handlerInput, { USER_ACTION: actions.ACTION_ASK_FOR_DONATION_AMOUNT });
    return responses.askForDonationAmountResponse(handlerInput);
  }
};

// 寄付したい金額を提供
const DecideDonationAmountIntentHandler = {
  canHandle(handlerInput) {
    helpers.logTrace('DecideDonationAmountIntentHandler.canHandle', handlerInput);
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'DecideDonationAmountIntent';
  },
  async handle(handlerInput) {
    helpers.logTrace('DecideDonationAmountIntentHandler.handle', handlerInput);

    //ユーザ発話から寄付したい金額を取り出す
    const amount = Alexa.getSlotValue(handlerInput.requestEnvelope, constants.SLOT_AMOUNT);

    //ユーザ提示の金額をうまく認識できない場合、もう一度金額を聞く
    if (!helpers.slotValueIsValidNumber(amount)) {
      helpers.saveSessionAttr(handlerInput, { USER_ACTION: actions.ACTION_ASK_FOR_DONATION_AMOUNT });
      return responses.askForCorrectDonationAmountResponse(handlerInput);
    }

    // 金額範囲は過大・過小の場合、もう一度金額を聞く
    if (!donationAmountIsValid(amount)) {
      helpers.saveSessionAttr(handlerInput, { USER_ACTION: actions.ACTION_ASK_FOR_DONATION_AMOUNT });
      return responses.askForValidDonationAmountResponse(handlerInput);
    }

    // 寄付の最終確認
    helpers.saveSessionAttr(handlerInput, {
      AMOUNT: amount,
      USER_ACTION: actions.ACTION_DONATION_FINAL_CONFIRMATION
    });
    return await responses.confirmDonationResponse(handlerInput);
  }
};

// 寄付したい金額を変更
const AmountChangeIntentHandler = {
  canHandle(handlerInput) {
    helpers.logTrace('AmountChangeIntentHandler.canHandle', handlerInput);
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AmountChangeIntent');
  },
  handle(handlerInput) {
    helpers.logTrace('AmountChangeIntentHandler.handle', handlerInput);

    // 金額がわからない場合、寄付金額を聞く
    helpers.saveSessionAttr(handlerInput, { USER_ACTION: actions.ACTION_ASK_FOR_DONATION_AMOUNT });
    return responses.askForDonationAmountResponse(handlerInput);
  }
};

// 金額指定のところで変な「はい」と回答
const DecideDonationAmountYesIntentHandler = {
  canHandle(handlerInput) {
    helpers.logTrace('DecideDonationAmountYesIntentHandler.canHandle', handlerInput);
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.YesIntent' &&
      handlerInput.attributesManager.getSessionAttributes().USER_ACTION === actions.ACTION_ASK_FOR_DONATION_AMOUNT;
  },
  async handle(handlerInput) {
    helpers.logTrace('DecideDonationAmountYesIntentHandler.handle', handlerInput);

    //もう一度寄付する金額を聞く
    helpers.saveSessionAttr(handlerInput, { USER_ACTION: actions.ACTION_ASK_FOR_DONATION_AMOUNT });
    return responses.askForCorrectDonationAmountResponse(handlerInput);
  }
};

// いいえ
const NoIntentHandler = {
  canHandle(handlerInput) {
    helpers.logTrace('NoIntentHandler.canHandle', handlerInput);
    const requestEnvelope = handlerInput.requestEnvelope;
    return Alexa.getRequestType(requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(requestEnvelope) === 'AMAZON.NoIntent';
  },
  async handle(handlerInput) {
    helpers.logTrace('NoIntentHandler.handle', handlerInput);

    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    // 寄付金額指定、または寄付の最終確認で「いいえ」と言われた場合
    if (sessionAttributes.USER_ACTION === actions.ACTION_ASK_FOR_DONATION_AMOUNT) {
      helpers.saveSessionAttr(handlerInput, {
        AMOUNT: undefined,
        USER_ACTION: actions.ACTION_ASK_FOR_DONATION_AMOUNT
      });
      return responses.askForCorrectDonationAmountResponse(handlerInput);
    }
    else if (sessionAttributes.USER_ACTION === actions.ACTION_DONATION_FINAL_CONFIRMATION) {
      helpers.saveSessionAttr(handlerInput, {
        AMOUNT: undefined,
        USER_ACTION: actions.ACTION_ASK_FOR_DONATION_AMOUNT
      });
      return responses.askForDonationAmountResponse(handlerInput);
    }

    // その他場合はスキルを終了
    // 永続アトリビュートをクリア
    await helpers.clearPersistentAttr(handlerInput);
    return await responses.goodbyeResponse(handlerInput);
  }
};

// 寄付の最終確認に対して「はい」と回答、Setup呼び出し
const DonationFinalConfirmationYesIntentHandler = {
  canHandle(handlerInput) {
    helpers.logTrace('DonationFinalConfirmationYesIntentHandler.canHandle', handlerInput);
    return handlerInput.attributesManager.getSessionAttributes().USER_ACTION === actions.ACTION_DONATION_FINAL_CONFIRMATION &&
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.YesIntent';
  },
  async handle(handlerInput) {
    helpers.logTrace('DonationFinalConfirmationYesIntentHandler.handle', handlerInput);

    // sessionが終了するので、sessionAttributesをpersistentAttributesに保存
    await helpers.saveSessionAttrToPersistentAttr(handlerInput);
    return await responses.setupDirective(handlerInput);
  }
};

// Setupレスポンス、Charge呼び出し
const ConnectionsSetupResponseHandler = {
  canHandle(handlerInput) {
    helpers.logTrace('ConnectionsSetupResponseHandler.canHandle', handlerInput);
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'Connections.Response' &&
      handlerInput.requestEnvelope.request.name === 'Setup';
  },
  async handle(handlerInput) {
    helpers.logTrace('ConnectionsSetupResponseHandler.handle', handlerInput);
    const actionResponseStatusCode = handlerInput.requestEnvelope.request.status.code;
    console.log('Setup API actionResponseStatusCode:', actionResponseStatusCode);
    console.log('Setup API ngreason:', handlerInput.requestEnvelope.request.status.message);

    // setup APIレスポンスエラー
    if (actionResponseStatusCode !== '200') {
      // セッションをクリア、スキル終了
      await helpers.clearPersistentAttr(handlerInput);
      return await responses.setupOrChargeErrorResponse(handlerInput);
    }
    
    // セッション情報復活
    await helpers.savePersistentAttrToSessionAttr(handlerInput);
    // chargeAPI呼び出し
    return await responses.chargeDirective(handlerInput);
  }
};

// Chargeレスポンス
const ConnectionsChargeResponseHandler = {
  canHandle(handlerInput) {
    helpers.logTrace('ConnectionsChargeResponseHandler.canHandle', handlerInput);
    return handlerInput.requestEnvelope.request.type === 'Connections.Response' &&
      handlerInput.requestEnvelope.request.name === 'Charge';
  },
  async handle(handlerInput) {
    helpers.logTrace('ConnectionsChargeResponseHandler.handle', handlerInput);

    const actionResponseStatusCode = handlerInput.requestEnvelope.request.status.code;
    const errorMessage = handlerInput.requestEnvelope.request.status.message;
    console.log('chargeAPI: actionResponseStatusCode', actionResponseStatusCode);
    console.log('chargeAPI: actionResponseMessage:', errorMessage);

    // charge APIレスポンスエラー
    if (actionResponseStatusCode !== '200') {
      // セッションをクリア、スキル終了
      await helpers.clearPersistentAttr(handlerInput);
      return await responses.setupOrChargeErrorResponse(handlerInput);
    }

    // authorizationDetailsから、stateを取得
    const actionResponsePayload = handlerInput.requestEnvelope.request.payload;
    const authorizationStatusState = actionResponsePayload.authorizationDetails.authorizationStatus.state;

    //決済に失敗
    if (authorizationStatusState === "Declined") {
      // 永続アトリビュートをクリア、スキル終了
      await helpers.clearPersistentAttr(handlerInput);
      return await responses.chargeDeclineResponse(handlerInput);
    }
    
    // セッション情報復活
    await helpers.savePersistentAttrToSessionAttr(handlerInput);
    // スキル終了するので、永続アトリビュートをクリア
    await helpers.clearPersistentAttr(handlerInput);
    // 寄付ありがとうございました
    return await responses.thankYouResponse(handlerInput);
  }
};


/* --------------------------------- 
   寄付のキャンセル、返金処理
------------------------------------- */
const OrderCancelAndRefundIntentHandler = {
  canHandle(handlerInput) {
    helpers.logTrace('OrderCancelAndRefundIntentHandler.canHandle', handlerInput);
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      (Alexa.getIntentName(handlerInput.requestEnvelope) === 'refundOrder' ||
        Alexa.getIntentName(handlerInput.requestEnvelope) === 'cancelOrder');
  },
  async handle(handlerInput) {
    helpers.logTrace('OrderCancelAndRefundIntentHandler.handle', handlerInput);
    // スキル終了するので、永続アトリビュートをクリア
    await helpers.clearPersistentAttr(handlerInput);
    return responses.orderCancelAndRefundResponse(handlerInput);
  }
};

/* --------------------------------- 
   戻って
------------------------------------- */
const PreviousIntentHandler = {
  canHandle(handlerInput) {
    helpers.logTrace('PreviousIntentHandler.canHandle', handlerInput);
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.PreviousIntent';
  },
  handle(handlerInput) {
    helpers.logTrace('PreviousIntentHandler.handle', handlerInput);
    return responses.generalGuideResponse(handlerInput);
  }
};

/* --------------------------------- 
   ヘルプ
------------------------------------- */
const HelpIntentHandler = {
  canHandle(handlerInput) {
    helpers.logTrace('HelpIntentHandler.canHandle', handlerInput);
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    helpers.logTrace('HelpIntentHandler.handle', handlerInput);
    return responses.generalGuideResponse(handlerInput);
  }
};

/* --------------------------------- 
   キャンセル、ストップ
------------------------------------- */
const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    helpers.logTrace('CancelAndStopIntentHandler.canHandle', handlerInput);
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent' ||
        Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
  },
  async handle(handlerInput) {
    helpers.logTrace('CancelAndStopIntentHandler.handle', handlerInput);
    // スキル終了するので、永続アトリビュートをクリア
    await helpers.clearPersistentAttr(handlerInput);
    return await responses.goodbyeResponse(handlerInput);
  }
};

/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says 'exit' or 'quit'. 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    helpers.logTrace('SessionEndedRequestHandler.canHandle', handlerInput);
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    helpers.logTrace('SessionEndedRequestHandler.handle', handlerInput);
    console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
    // Any cleanup logic goes here.
    return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
  }
};


/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
  canHandle(handlerInput) {
    helpers.logTrace('IntentReflectorHandler.canHandle', handlerInput);
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
  },
  handle(handlerInput) {
    helpers.logTrace('IntentReflectorHandler.handle', handlerInput);
    return responses.genericErrorResponse(handlerInput);
  }
};


/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(error);
    console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);
    return responses.genericErrorResponse(handlerInput);
  }
};


/* --------------------------------- 
   helpers
------------------------------------- */
// 寄付金額の過大過小チェック
function donationAmountIsValid(amount) {
  return parseInt(amount, 10) >= constants.MIN_AMOUNT_VALUE && parseInt(amount, 10) <= constants.MAX_AMOUNT_VALUE;
}


module.exports = {
  LaunchRequestHandler,
  YesToDonateIntentHandler,
  DecideDonationAmountIntentHandler,
  AmountChangeIntentHandler,
  DecideDonationAmountYesIntentHandler,
  NoIntentHandler,
  DonationFinalConfirmationYesIntentHandler,
  ConnectionsSetupResponseHandler,
  ConnectionsChargeResponseHandler,
  OrderCancelAndRefundIntentHandler,
  PreviousIntentHandler,
  HelpIntentHandler,
  CancelAndStopIntentHandler,
  SessionEndedRequestHandler,
  IntentReflectorHandler,
  ErrorHandler
};
