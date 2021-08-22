import {Router} from "express";
import web3, {admin} from "../utils/GetWeb3";
import AmazonPayDonation from "../contracts/AmazonPayDonation.json";
import {AbiItem} from "web3-utils";
import * as AmazonPay from "amazon-payments";

const networkId = "3";
const amazonPayDonationContract = new web3.eth.Contract(
  AmazonPayDonation.abi as AbiItem[],
  AmazonPayDonation.networks[networkId].address
);

const amazonPay = AmazonPay.connect({
  environment: AmazonPay.Environment.Production,
  clientId: "amzn1.application-oa2-client.c628622e2d4f478cb8f8b343493cbc8c"
});

const router = Router();

const writeToBlockChain = (userId: string, oroId: string, amount: number) => {
  return new Promise(async (resolve, reject) => {
    const tx = await amazonPayDonationContract.methods.saveDonation(
      [userId, oroId, amount, 0]
    );

    try {
      const [gasPrice, gas] = await Promise.all([
        web3.eth.getGasPrice(),
        tx.estimateGas({
          from: admin
        }),
      ]);

      tx.send({
        from: admin,
        gas,
        gasPrice
      })
        .once("sending", (payload: object) => {
          console.log("sending");
        })
        .once("transactionHash", (transactionHash: string) => {
          resolve(transactionHash);
        })
        .once("error", (error: Error) => {
          reject(error);
        });
    } catch (e) {
      //ignore
      reject(e);
    }
  });
}

router.post("/", async (req, res) => {

  console.log(req.body);

  const accessToken = req.body.accessToken;
  const oroId = req.body.oroId;
  const amount = req.body.amount;

  amazonPay.api.getProfile(accessToken,
    (error: any, accessToken: any) => {
      if (error) {
        res.json({
          error: error.message
        });
        return;
      }

      writeToBlockChain(accessToken.user_id, oroId, amount).then((transactionHash) => {
        res.json({
          hash: transactionHash
        })
      }).catch(error => {
        res.json({
          error: error.methods
        })
      });
    });
});

export default router;