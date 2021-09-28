import {Router} from "express";
import * as AmazonPay from "amazon-payments";
import {writeToBlockChain} from "../utils";
import * as AWS from 'aws-sdk';

const SQS = new AWS.SQS({region: 'ap-northeast-1'});
const QueueUrl = process.env.QUEUE_URL || '';

const amazonPay = AmazonPay.connect({
  environment: AmazonPay.Environment.Production,
  clientId: process.env.AMAZON_PAY_CLIENT_ID || "amzn1.application-oa2-client.c628622e2d4f478cb8f8b343493cbc8c"
});

const router = Router();

const sendMessageToSqs = (message) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sendMessage = await SQS.sendMessage({MessageBody: JSON.stringify(message), QueueUrl}).promise();
      resolve({
        status: 200,
        body: sendMessage
      })
    } catch (error) {
      console.log(error);
      reject({
        status: 502,
        message: error
      });
    }
  })
}


router.post("/", async (req, res) => {
  console.log("POST", req.body);
  const accessToken = req.body.accessToken;
  const oroId = req.body.oroId;
  const amount = req.body.amount;

  if (accessToken === "dummy") {
    const userId = req.body.userId;
    writeToBlockChain(userId, oroId, amount).then((transactionHash) => {
      res.json({
        hash: transactionHash
      })
    }).catch(error => {
      res.json({
        error: error.message,
        type: "writeToBlockChain:error"
      })
    });
  } else {
    amazonPay.api.getProfile(accessToken,
      (error: any, accessToken: any) => {
        if (error) {
          res.json({
            error: error.message,
            type: "getProfile:error"
          });
          return;
        }

        writeToBlockChain(accessToken.user_id, oroId, amount).then((transactionHash) => {
          res.json({
            hash: transactionHash
          })
        }).catch(error => {
          res.json({
            error: error.message,
            type: "writeToBlockChain:error"
          })
        });
      });
  }
});

router.post("/sqs", async (req, res) => {

  const accessToken = req.body.accessToken;
  const oroId = req.body.oroId;
  const amount = req.body.amount;

  if (accessToken === "dummy") {
    const message = {
      userId: req.body.userId || "test",
      oroId: req.body.oroId,
      amount: 100
    }
    sendMessageToSqs(message)
      .then((result) => res.json(result))
      .catch((error) => res.json(error));
  } else {
    amazonPay.api.getProfile(accessToken,
      (error: any, accessToken: any) => {
        if (error) {
          res.json({
            error: error.message,
            type: "getProfile:error"
          });
          return;
        }

        const message = {
          userId: accessToken.user_id,
          oroId,
          amount
        }

        sendMessageToSqs(message)
          .then((result) => res.json(result))
          .catch((error) => res.json(error));

      });
  }
});

export default router;