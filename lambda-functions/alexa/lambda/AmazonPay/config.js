'use strict';

const INIT = {
    sandboxCustomerEmailId: process.env.AMAZONPAY_SANDBOX_EMAIL, // Amazon Pay sandbox test email    
    sellerId: process.env.AMAZONPAY_SELLER_ID, // Amazon Pay seller ID     
};

const GLOBAL = {
    version: '2',
    paymentAction: 'AuthorizeAndCapture', // 'Authorize' or 'AuthorizeAndCapture'
    needAmazonShippingAddress: false, // Must be boolean
    transactionTimeout: 0, // The default and recommended value for Alexa transactions is 0
};

const REGIONAL = {
    countryOfEstablishment: 'JP',
    ledgerCurrency: 'JPY',
    checkoutLanguage: 'ja_JP',
    customInformation: '', // Optional; Max 1024 chars
    sellerAuthorizationNote: '', // Optional; Max 255 chars; In sandbox mode you can pass simulation strings.
    sellerNote: 'ご寄付ありがとうございました', // Optional; Max 1024 chars, visible on confirmation mails to buyers
    sellerStoreName: 'DEV DAY 寄付デモ', // Optional; Documentation calls this out as storeName not sellerStoreName
    softDescriptor: '', // Optional; Max 16 chars; This value is visible on customers credit card statements
};

module.exports = {
    INIT: INIT,
    GLOBAL: GLOBAL,
    REGIONAL: REGIONAL
};
