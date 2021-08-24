import React, { useEffect, useState } from "react";
import { Link, TableCell, TableRow } from "@material-ui/core";
import Skeleton from '@material-ui/lab/Skeleton';
import { EventData } from "web3-eth-contract";
import ShortId from "./ShortId";
import amountToJpy from "../utils/amountToJpy";
import { web3 } from "../utils/donationContract";
import { BlockTransactionString } from "web3-eth";
import timestampToDatetime from "../utils/timestampToDatetime";


interface DonationDetailsProps {
  transaction: EventData;
}

interface BlockTransactionStringWithDatetime extends BlockTransactionString {
  datetime: string;
}

type TransactionWithBlock = {
  transaction?: EventData,
  block?: BlockTransactionStringWithDatetime
}

const TransactionTableRow: React.FC<DonationDetailsProps> = ({ transaction }) => {

  const [transactionWithBlock, setTransactionWithBlock] = useState<TransactionWithBlock>({});


  const getBlock = (blockId: string) => {
    web3.eth.getBlock(blockId)
      .then((blockTransaction) => {
        const datetime = timestampToDatetime(Number(blockTransaction.timestamp));
        const block: BlockTransactionStringWithDatetime = { ...blockTransaction, datetime }
        setTransactionWithBlock({ transaction, block });
      });
  }

  useEffect(() => {
    getBlock(transaction.blockNumber.toString());
  }, [transaction]);


  return (<>
      {!transactionWithBlock.transaction ? <Skeleton/> : (
        <TableRow>
          <TableCell>
            <Link
              target={"_blank"}
              href={`https://ropsten.etherscan.io/tx/${transactionWithBlock.transaction.transactionHash}`}><ShortId
              id={transactionWithBlock.transaction.transactionHash}/>
            </Link>
          </TableCell>
          <TableCell>
            {transactionWithBlock.block?.datetime}
          </TableCell>
          <TableCell>
            <ShortId id={transactionWithBlock.transaction.returnValues.userId} />
          </TableCell>
          <TableCell>
            {amountToJpy(transactionWithBlock.transaction.returnValues.amount)}
          </TableCell>
        </TableRow>
      )
      }
    </>
  );
}

export default TransactionTableRow;