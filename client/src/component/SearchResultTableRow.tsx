import React, { useEffect, useState } from "react";
import { TableCell, TableRow } from "@material-ui/core";
import ShortId from "./ShortId";
import amountToJpy from "../utils/amountToJpy";
import donationContract from "../utils/donationContract";
import timestampToDatetime from "../utils/timestampToDatetime";

interface DonationDetailsProps {
  userId: string;
  count: number;
}

type Donation = { userId: string; timestamp: number; datetime:string; amount: number; oroId: string; };

const TransactionTableRow: React.FC<DonationDetailsProps> = ({ userId, count }) => {

  const [detail, setDetail] = useState<Donation>({
    userId: userId,
    oroId: "",
    timestamp: 0,
    amount: 0,
    datetime: ""
  });

  useEffect(() => {
    donationContract.methods.donationByUser(userId, count).call()
      .then((donation: Donation) => {
        const datetime = timestampToDatetime(Number(donation.timestamp));
        setDetail({...donation, datetime: datetime});
      });
  }, [userId, count]);

  return (<TableRow>
    <TableCell component="th" scope="row">
      <ShortId id={detail.oroId}/>
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