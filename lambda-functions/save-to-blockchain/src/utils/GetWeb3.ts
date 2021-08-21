import Web3 from 'web3';

const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || "";
const RPC_SERVER = process.env.RPC_SERVER || "";

const web3 = new Web3(RPC_SERVER);

export const { address: admin } = web3.eth.accounts.wallet.add(WALLET_PRIVATE_KEY);

export default web3;