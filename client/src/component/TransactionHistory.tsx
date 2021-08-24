import React, { useEffect, useState } from "react";
import donationContract from "../utils/donationContract";
import TransactionTable from "./TransactionTable";
import { EventData } from "web3-eth-contract";

const TransactionHistory = () => {
  const [items, setItems] = useState<EventData[]>([]);
  useEffect(() => {
    donationContract.getPastEvents("Donated", {
      fromBlock: 0
    },).then((events) => {
      const [one,_] = events;
      setItems(events.reverse());
    })
  }, []);


  return (
    <TransactionTable items={items}/>
  )

}

export default TransactionHistory;