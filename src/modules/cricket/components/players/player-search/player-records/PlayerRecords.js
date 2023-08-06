import * as React from "react";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import "./PlayerRecords.scss";
import { Chip } from "@mui/material";

// Generate Order Data
// function createData(id, date, name, shipTo, paymentMethod, amount) {
//   return { id, date, name, shipTo, paymentMethod, amount };
// }

// const rows = [
//   createData(
//     0,
//     "16 Mar, 2019",
//     "Elvis Presley",
//     "Tupelo, MS",
//     "VISA ⠀•••• 3719",
//     312.44
//   ),
//   createData(
//     1,
//     "16 Mar, 2019",
//     "Paul McCartney",
//     "London, UK",
//     "VISA ⠀•••• 2574",
//     866.99
//   ),
//   createData(
//     2,
//     "16 Mar, 2019",
//     "Tom Scholz",
//     "Boston, MA",
//     "MC ⠀•••• 1253",
//     100.81
//   ),
//   createData(
//     3,
//     "16 Mar, 2019",
//     "Michael Jackson",
//     "Gary, IN",
//     "AMEX ⠀•••• 2000",
//     654.39
//   ),
//   createData(
//     4,
//     "15 Mar, 2019",
//     "Bruce Springsteen",
//     "Long Branch, NJ",
//     "VISA ⠀•••• 5919",
//     212.79
//   ),
// ];

function preventDefault(event) {
  event.preventDefault();
}

export default function PlayerRecords({ records }) {
  return (
    <div className="player-records-wrapper">
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Recent Matches
      </Typography>
      <Table size="medium">
        <TableHead>
          <TableRow>
            <TableCell className="date-section">Date</TableCell>
            <TableCell className="batting-section">R</TableCell>
            <TableCell className="batting-section">B</TableCell>
            <TableCell className="batting-section">4's</TableCell>
            <TableCell className="batting-section">6's</TableCell>

            {/* <TableCell>Bow Inn</TableCell> */}
            <TableCell className="bowling-section">R</TableCell>
            <TableCell className="bowling-section">B</TableCell>
            <TableCell className="bowling-section">M</TableCell>
            <TableCell className="bowling-section">W</TableCell>
            {/* <TableCell align="right">Sale Amount</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {records
            .sort((a, b) => b.created - a.created)
            .map((row, index) => (
              <TableRow key={`${row.id}_${index}`}>
                <TableCell className="date-section">
                  {new Date(row.created * 1000).toLocaleDateString()}
                </TableCell>
                {row.bowlingInnings || row.battingInnings ? (
                  <>
                    <TableCell className="batting-section">
                      {row.battingInnings ? row.runs : "-"}
                    </TableCell>
                    <TableCell className="batting-section">
                      {row.battingInnings ? row.balls : "-"}
                    </TableCell>
                    <TableCell className="batting-section">
                      {row.battingInnings ? row.fours : "-"}
                    </TableCell>
                    <TableCell className="batting-section">
                      {row.battingInnings ? row.sixes : "-"}
                    </TableCell>

                    <TableCell className="bowling-section">
                      {row.bowlingInnings ? row.bowlingRuns : "-"}
                    </TableCell>
                    <TableCell className="bowling-section">
                      {row.bowlingInnings ? row.bowlingBalls : "-"}
                    </TableCell>
                    <TableCell className="bowling-section">
                      {row.bowlingInnings ? row.maidens : "-"}
                    </TableCell>
                    <TableCell className="bowling-section">
                      {row.bowlingInnings ? row.wickets : "-"}
                    </TableCell>
                  </>
                ) : (
                  <TableCell
                    align="center"
                    colSpan={8}
                    sx={{ backgroundColor: "#f1f8e2" }}
                  >
                    <Chip
                      label="Did Not Played"
                      sx={{ backgroundColor: "lightcoral", color: "white" }}
                      size="small"
                    />
                  </TableCell>
                )}
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {/* <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
        See more orders
      </Link> */}
    </div>
  );
}
