import {Router} from "express";
import web3, {admin} from "../utils/GetWeb3";
import SimpleStorage from "../contracts/SimpleStorage.json";
import {AbiItem} from "web3-utils";

const simpleStorageContract = new web3.eth.Contract(SimpleStorage.abi as AbiItem[], SimpleStorage.networks["3"].address);

const router = Router();

router.get("/", async (req, res) => {
  const num = await simpleStorageContract.methods.get().call();
  const tx = await simpleStorageContract.methods.set(Number(num) + 1);
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
    });
});

router.get("/get", async (req, res) => {
  const num = await simpleStorageContract.methods.get().call();
  return res.json({
    message: num
  })
});

export default router;