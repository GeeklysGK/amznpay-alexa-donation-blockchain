import React, { useEffect, useState } from "react";
import { TableCell, TableRow } from "@material-ui/core";
import ShortId from "./ShortId";
import amountToJpy from "../utils/amountToJpy";
import donationContract from "../utils/donationContract";

interface DonationDetailsProps {
  userId: string;
  count: number;
}

type Donation = { userId: string; timestamp: number; datetime:string; amount: number; };

const TransactionTableRow: React.FC<DonationDetailsProps> = ({ userId, count }) => {

  const [detail, setDetail] = useState<Donation>({
    userId: userId,
    timestamp: 0,
    amount: 0,
    datetime: ""
  });

  useEffect(() => {
    donationContract.methods.donations(userId, count).call()
      .then((donation: Donation) => {
        const date = new Date(donation.timestamp * 1000);
        const datetime = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        setDetail({...donation, datetime: datetime});
      });
  }, [userId, count]);

  return (<TableRow>
    <TableCell component="th" scope="row">
      <ShortId id={detail.userId}/>
    </TableCell>
    <TableCell component="th" scope="row">
      {detail.datetime}
    </TableCell>
    <TableCell component="th" scope="row">
      {amountToJpy(detail.amount)}
    </TableCell>
  </TableRow>);
}

export default TransactionTableRow;