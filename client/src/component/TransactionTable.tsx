import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import React from "react";
import DonationDetails from "./DonationDetails";
import { EventData } from "web3-eth-contract";

type TransactionTableProps = {
  items: EventData[]
}

const TransactionTable: React.FC<TransactionTableProps> = ({ items }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Amazon決済ID</TableCell>
          <TableCell>日付</TableCell>
          <TableCell>寄付金額</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map((item, index) => {
          return <DonationDetails key={index} transaction={item}/>
        })}
      </TableBody>
    </Table>
  )
}

export default TransactionTable;