import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import React from "react";

interface SearchResultTableProps {
  rows: any;
}

const SearchResultTable:React.FC<SearchResultTableProps> = ({rows}) => {
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
        {rows}
      </TableBody>
    </Table>
  )
}

export default SearchResultTable;