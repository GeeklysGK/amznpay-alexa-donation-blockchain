import {Callback, Context, SQSEvent} from "aws-lambda";
import {writeToBlockChain} from "./utils";
import * as AWS from 'aws-sdk';

const SQS = new AWS.SQS({region: 'ap-northeast-1'});
const QueueUrl = process.env.QUEUE_URL || '';

exports.handler = async (event: SQSEvent, context: Context, callback: Callback) => {
  console.log("SQSHandler", event.Records.length);
  try {
    let error = null;
    for (const message of event.Records) {
      // キューの処理
      console.log("message", message);
      const json = JSON.parse(message.body);
      const userId = json.userId || "test";

      try {
        const tx = await writeToBlockChain(userId, json.oroId, json.amount);
        console.log(tx);
        message.receiptHandle
        await SQS.deleteMessage({
          QueueUrl,
          ReceiptHandle: message.receiptHandle
        }).promise();
      } catch (e) {
        console.error(e.message);
        error = e.message;
        break;
      }
    }
    callback(error, error === null ? 'success' : null);
  } catch (e) {
    callback(e);
  }
}