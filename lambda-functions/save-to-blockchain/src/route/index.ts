import {Router} from "express";
import web3, {admin} from "../utils/GetWeb3";
import AmazonPayDonation from "../contracts/AmazonPayDonation.json";
import {AbiItem} from "web3-utils";

const networkId = "3";
const amazonPayDonationContract = new web3.eth.Contract(
  AmazonPayDonation.abi as AbiItem[],
  AmazonPayDonation.networks[networkId].address
);

const router = Router();

router.get("/", async (req, res) => {
  const tx = await amazonPayDonationContract.methods.saveDonation(
    ["test", "P04-0000-0000", 5000, 0]
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
        return res.json({
          message: transactionHash
        })
      })
      .once("error", (error: Error) => {
        return res.json({
          error: error.message
        })
      });
  } catch (e) {
    //ignore
    // return res.json({
    //   error: "something was wrong"
    // })
  }

});

export default router;