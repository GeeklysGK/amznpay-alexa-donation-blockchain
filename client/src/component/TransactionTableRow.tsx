import React from "react";
import { Link, TableCell, TableRow } from "@material-ui/core";
import { EventData } from "web3-eth-contract";
import ShortId from "./ShortId";
import amountToJpy from "../utils/amountToJpy";

interface DonationDetailsProps {
  transaction: EventData;
}

const TransactionTableRow: React.FC<DonationDetailsProps> = ({ transaction }) => {
  return (<TableRow>
    <TableCell component="th" scope="row">
      <Link
        target={"_blank"}
        href={`https://ropsten.etherscan.io/tx/${transaction.transactionHash}`}><ShortId
        id={transaction.transactionHash}/></Link>
    </TableCell>
    <TableCell component="th" scope="row">
      {transaction.returnValues.userId}
    </TableCell>
    <TableCell component="th" scope="row">
      {amountToJpy(transaction.returnValues.amount)}
    </TableCell>
  </TableRow>);
}

export default TransactionTableRow;