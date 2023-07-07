import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

import Divider from "@mui/material/Divider";
import "./MatchToss.scss";

export default function MatchToss({
  teamA,
  teamB,
  tossWonBy,
  optedTo,
  tossValueChange,
  tossDecidedChange,
}) {
  const [toss, setToss] = React.useState(tossWonBy ? tossWonBy.id : teamA.id);
  const [decidedTo, setDecidedTo] = React.useState(
    tossWonBy && optedTo && tossWonBy.id !== optedTo.id ? 2 : 1
  );

  React.useEffect(() => {
    setToss(tossWonBy ? tossWonBy.id : teamA.id);
  }, [tossWonBy, teamA]);

  const handleTossChange = (event) => {
    const tossId = Number(event.target.value);
    setToss(tossId);
    tossValueChange(teamA && teamA.id === tossId ? teamA : teamB);
    // console.log("ope", teamA && teamA.id === tossId);
    tossDecidedChange(
      teamA && teamA.id === tossId && parseInt(decidedTo, 10) === 1
        ? teamA
        : teamB
    );
  };

  const handleDecidedToChange = (event) => {
    const optVal = event.target.value;
    // console.log("ope", optVal, toss, teamA.id, parseInt(optVal, 10) === 1);
    setDecidedTo(optVal);
    tossDecidedChange(
      (teamA && teamA.id === toss && parseInt(optVal, 10) === 1) ||
        (teamB && teamB.id === toss && parseInt(optVal, 10) === 2)
        ? teamA
        : teamB
    );
  };

  return (
    <div className="match-toss-wrapper">
      <FormControl>
        <FormLabel id="demo-controlled-radio-buttons-group">
          Toss Won By
        </FormLabel>
        <RadioGroup
          row
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={toss}
          onChange={handleTossChange}
        >
          <FormControlLabel
            value={teamA ? teamA.id : -1}
            control={<Radio />}
            label={teamA ? teamA.name : ""}
          />
          <FormControlLabel
            value={teamB ? teamB.id : -2}
            control={<Radio />}
            label={teamB ? teamB.name : ""}
          />
        </RadioGroup>
      </FormControl>

      <Divider variant="middle" />
      <FormControl>
        <FormLabel id="decided-controlled-radio-buttons-group">
          Decided To
        </FormLabel>
        <RadioGroup
          row
          aria-labelledby="decided-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={decidedTo}
          onChange={handleDecidedToChange}
        >
          <FormControlLabel value={1} control={<Radio />} label={"Bat"} />
          <FormControlLabel value={2} control={<Radio />} label={"Bowl"} />
        </RadioGroup>
      </FormControl>
    </div>
  );
}
