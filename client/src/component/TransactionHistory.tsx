import React, { useEffect, useState } from "react";
import donationContract from "../utils/donationContract";
import TransactionTable from "./TransactionTable";
import { EventData } from "web3-eth-contract";
import amountToJpy from "../utils/amountToJpy";

const TransactionHistory = () => {
  const [items, setItems] = useState<EventData[]>([]);
  useEffect(() => {


  }, []);


  return (
    <TransactionTable items={items}/>
  )

}

export default TransactionHistory;