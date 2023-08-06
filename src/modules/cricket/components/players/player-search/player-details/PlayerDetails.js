import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlayerRecords from "../player-records/PlayerRecords";
import "./PlayerDetails.scss";

export default function PlayerDetails({
  player,
  records,
  selectedIndex,
  currentIndex,
  handleChange,
}) {
  return (
    <div className="player-details-wrapper">
      <Accordion
        expanded={selectedIndex === currentIndex}
        onChange={() => handleChange(currentIndex)}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={{ backgroundColor: "cadetblue", color: "white" }}
        >
          <Typography variant="h6">{player.name}</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ padding: "5px", backgroundColor: "#e8f0e6" }}>
          <PlayerRecords records={records} />
        </AccordionDetails>
      </Accordion>
      {/* <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>Accordion 2</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion disabled>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3a-content"
          id="panel3a-header"
        >
          <Typography>Disabled Accordion</Typography>
        </AccordionSummary>
      </Accordion> */}
    </div>
  );
}
