/* *
 * We create a language strings object containing all of our strings.
 * The keys for each string will then be referenced in our code, e.g. handlerInput.t("WELCOME_MSG").
 * The localisation interceptor in index.js will automatically choose the strings
 * that match the request"s locale.
 * */

module.exports = {
    ja: {
        translation: {
            ASK_FOR_DONATION: "DEV DAY 寄付デモへようこそ！\n寄付しますか？",
            ASK_FOR_DONATION_REPROMPT: "DEV DAY 寄付デモへ寄付しますか？はいか、いいえでお答えください。",
            
            GENERAL_GUIDE: "寄付をする場合、「百円寄付して」と言ってみてください。どうぞ！",
            GENERAL_GUIDE_HEADLINE: "「百円寄付して」\nと言ってみてください",

            HOW_MUCH_DO_YOU_DONATE: "いくら寄付しますか？",
            ASK_FOR_AMOUNT_AGAIN: "すみません、金額が聞き取れませんでした。もう一度寄付する金額を言ってください。",
            ASK_FOR_AMOUNT_AGAIN_HEADLINE: "もう一度寄付する金額\nを言ってください",

            AMOUNT_VALUE_ERROR: "申し訳ございません、100円から1万円までの範囲しか寄付できません。いくら寄付しますか？",
            AMOUNT_VALUE_ERROR_HEADLINE: "100円から1万円までの範囲で\n寄付してください",
            AMOUNT_VALUE_ERROR_REPROMPT: "100円から1万円までの範囲しか寄付できません。寄付する金額を言ってください。",
            
            CONFIRM_DONATION_AMOUNT: "DEV DAY 寄付デモに\n{{AMOUNT}}円を寄付しますか？",
            CONFIRM_DONATION_AMOUNT_REPROMPT: "DEV DAY 寄付デモに{{AMOUNT}}円を寄付しますか？はいか、いいえでお答えください。",

            ERROR_PeriodicAmountExceeded: "月にご利用いただける金額を上回ったので決済できませんでした。来月再度お試しください。",
            ERROR_GeneralConnection: "予期せぬエラーが発生して、決済をすることができませんでした。Amazon.co.jpでお使いのクレジットカードをご確認ください。",

            GOODBYE: "またの\nご支援をお待ちしております",
            THANK_YOU: "DEV DAY 寄付デモに{{AMOUNT}}円を寄付しました。温かいご支援、誠にありがとうございました！",
            THANK_YOU_HEADLINE: "ご支援ありがとうございました！",

            ERROR: "ごめんなさい。なんだかうまくいかないようです。もう一度言ってみてください。",
            ERROR_HEADLINE: "もう一度\n言ってみてください",

            CAN_NOT_REFUND: "申し訳ございません、寄付のキャンセルや返金はできません。お問い合わせが必要な場合は、Amazon PayのマイページからAmazonカスタマサービスにお問い合わせいただく事ができます。Alexaアプリにも手順のカードを送りましたので、そちらをご確認ください。",
            CAN_NOT_REFUND_HEADLINE: "Amazonカスタマサービスに\nお問い合わせください",
            CAN_NOT_REFUND_CARD_TITLE: "返金やキャンセルについて",
            CAN_NOT_REFUND_CARD_CONTENT: "1. Amazon Payにログインします\nhttps://pay.amazon.com/jp \n" +
                "2. 「お支払い方法設定一覧」をクリック\n" +
                "3. 一覧から「日本赤十字社」行の「詳細」をクリック\n" +
                "4. 詳細ページの中にある「Amazon Pay カスタマーサービスへのご連絡」から問い合わせる事ができます\n",
                
            HINT_YES_NO: "はいか、いいえでお答えください",
            HINT_AMOUNT: "寄付する金額を指定してください",
            HINT_CARD: "Alexaアプリにカードをお送りました",
            
        }
    }
};
