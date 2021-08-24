import Web3 from "web3";
import { RPC_NODE_URL } from "../constant";
import AmazonPayDonationJson from "../contracts/AmazonPayDonation.json";
import { AbiItem } from "web3-utils";

export const web3 = new Web3(RPC_NODE_URL);
export const contractAddress = AmazonPayDonationJson.networks["3"].address;
const donationContract = new web3.eth.Contract(AmazonPayDonationJson.abi as AbiItem[], contractAddress);

export default donationContract;