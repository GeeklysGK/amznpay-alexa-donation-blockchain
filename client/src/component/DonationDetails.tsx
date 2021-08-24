import React from "react";
import { TableCell, TableRow } from "@material-ui/core";
import { EventData } from "web3-eth-contract";
import ShortId from "./ShortId";
import Web3 from "web3";
import amountToJpy from "../utils/amountToJpy";

const web3 = new Web3()

interface DonationDetailsProps {
  transaction: EventData;
}

const DonationDetails: React.FC<DonationDetailsProps> = ({ transaction }) => {

  return (<TableRow>
    <TableCell component="th" scope="row">
      <ShortId id={transaction.transactionHash}/>
    </TableCell>
    <TableCell component="th" scope="row">
      <ShortId id={Web3.utils.toAscii(transaction.returnValues.userId)}/>
    </TableCell>
    <TableCell component="th" scope="row">
      {amountToJpy(transaction.returnValues.amount)}
    </TableCell>
  </TableRow>);
}

export default DonationDetails;