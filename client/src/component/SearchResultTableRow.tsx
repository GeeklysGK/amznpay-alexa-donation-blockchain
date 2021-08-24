import React, { useEffect, useState } from "react";
import { TableCell, TableRow } from "@material-ui/core";
import ShortId from "./ShortId";
import amountToJpy from "../utils/amountToJpy";
import donationContract from "../utils/donationContract";

interface DonationDetailsProps {
  userId: string;
  count: number;
}

type Donation = { userId: string; timestamp: number; amount: number; };

const TransactionTableRow: React.FC<DonationDetailsProps> = ({ userId, count }) => {

  const [detail, setDetail] = useState<Donation>({
    userId: userId,
    timestamp: 0,
    amount: 0
  });

  useEffect(() => {
    donationContract.methods.donations(userId, count).call()
      .then((donation: Donation) => setDetail(donation));
  }, [userId, count]);

  return (<TableRow>
    <TableCell component="th" scope="row">
      <ShortId id={detail.userId}/>
    </TableCell>
    <TableCell component="th" scope="row">
      {detail.timestamp}
    </TableCell>
    <TableCell component="th" scope="row">
      {amountToJpy(detail.amount)}
    </TableCell>
  </TableRow>);
}

export default TransactionTableRow;