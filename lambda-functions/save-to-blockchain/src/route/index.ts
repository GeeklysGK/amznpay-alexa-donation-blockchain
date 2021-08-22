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
  try {
    const sendMessage = await SQS.sendMessage({MessageBody: JSON.stringify(req.body), QueueUrl}).promise();
    return res.json({
      status: 200,
      body: sendMessage
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: 502,
      message: error
    });
  }


});

export default router;