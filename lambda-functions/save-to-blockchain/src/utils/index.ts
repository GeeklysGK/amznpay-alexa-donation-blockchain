import web3, {admin} from "./GetWeb3";
import AmazonPayDonation from "../contracts/AmazonPayDonation.json";
import {AbiItem} from "web3-utils";

const networkId = "3";
export const amazonPayDonationContract = new web3.eth.Contract(
  AmazonPayDonation.abi as AbiItem[],
  AmazonPayDonation.networks[networkId].address
);

export const writeToBlockChain = (userId: string, oroId: string, amount: number) => {
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