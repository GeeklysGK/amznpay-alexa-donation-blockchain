import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import React from "react";
import TransactionTableRow from "./TransactionTableRow";
import { EventData } from "web3-eth-contract";

type TransactionTableProps = {
  items: EventData[]
}

const TransactionTable: React.FC<TransactionTableProps> = ({ items }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Transaction Id</TableCell>
          <TableCell>Date</TableCell>
          <TableCell>AmazonPay注文ID</TableCell>
          <TableCell>寄付金額</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map((item, index) => {
          return <TransactionTableRow key={index} transaction={item}/>
        })}
      </TableBody>
    </Table>
  )
}

export default TransactionTable;