import * as React from "react";
import { useSelector } from "react-redux";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import "./BatsmenCard.scss";

export default function BatsmenCard() {
  const labels = ["Batsmen", "R", "B", "4s", "6s", "SR"];
  const bowlerLabels = ["Bowler", "O", "M", "R", "W", "ER"];
  const gridSpaces = [4, 1, 1, 1, 1, 2];
  const minWidths = [0, "12%", "12%", "12%", "12%", 0];
  const batsmen1Items = [];
  const batsmen2Items = [];
  const bowlerItems = [];
  const strikerBatsmenId = 0;

  const {
    scoreboard: { isFirstInnings, firstInnings, secondInnings },
  } = useSelector((state) => state.cricket);

  const innings = isFirstInnings ? firstInnings : secondInnings;
  const [open, setOpen] = React.useState(false);

  const { batsmen1, batsmen2, currentBowler } = innings;

  const batsmenKeys = ["name", "runs", "balls", "fours", "sixes", "strikeRate"];

  const bowlerKeys = [
    "name",
    "overs",
    "maidens",
    "bowlingRuns",
    "wickets",
    "econRate",
  ];

  batsmenKeys.forEach((key) => {
    if (batsmen1) {
      if (key === "name" && batsmen1["isStriker"]) {
        batsmen1Items.push(`${batsmen1[key]} *`);
      } else {
        batsmen1Items.push(batsmen1[key] || 0);
      }
    }
    if (batsmen2) {
      if (key === "name" && batsmen2["isStriker"]) {
        batsmen2Items.push(`${batsmen2[key]} *`);
      } else {
        batsmen2Items.push(batsmen2[key] || 0);
      }
    }
  });

  bowlerKeys.forEach((key) => {
    if (key === "overs") {
      bowlerItems.push(
        `${parseInt(currentBowler.bowlingBalls / 6)}.${
          currentBowler.bowlingBalls % 6
        }`
      );
    } else bowlerItems.push(currentBowler[key] || 0);
  });

  const getGridItems = (items, isHeader) => {
    return (
      <Grid
        container
        spacing={2}
        direction={"row"}
        justifyContent={"flex-start"}
        alignItems={"start"}
        sx={{
          backgroundColor: isHeader ? "lightseagreen" : "#f3f9e0",
          color: isHeader ? "white" : "black",
          borderRadius: "4px",
        }}
      >
        {items &&
          items.map((itemVal, index) => (
            <Grid
              key={index}
              item
              xs={gridSpaces[index]}
              sx={{
                minWidth: minWidths[index],
                // fontWeight: isHeader ? 800 : 500,
                display: "flex",
                flexDirection: "row",
              }}
              // xs={index === 0 ? 6 : 1}
              // sm={index === 0 ? 4 : 1}
              // md={index === 0 ? 6 : 1}
            >
              <Typography
                variant={isHeader ? "caption" : "subtitle2"}
                display="block"
                gutterBottom
              >
                {itemVal}
              </Typography>
              {/* {isHeader && index === 0 && (
                <AddCircleOutlineIcon
                  fontSize="small"
                  sx={{
                    marginTop: "-2px",
                    cursor: "pointer",
                    paddingLeft: "3px",
                    color: "lightgray",
                  }}
                  onClick={() => console.log("sdsdsd")}
                />
              )} */}
            </Grid>
          ))}
      </Grid>
    );
  };
  return (
    <div className="batsmen-card-wrapper">
      <Card sx={{ minWidth: 275 }}>
        <CardContent sx={{ paddingRight: 0 }}>
          {/* <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Word of the Day
        </Typography> */}
          <Stack direction="column" spacing={2}>
            {getGridItems(labels, true)}
            {/* <Divider /> */}
            <div>{getGridItems(batsmen1Items, false)}</div>
            <div>{getGridItems(batsmen2Items, false)}</div>
          </Stack>
          <br />
          <Stack direction="column" spacing={2}>
            {getGridItems(bowlerLabels, true)}
            {/* <Divider /> */}
            <div>{getGridItems(bowlerItems, false)}</div>
          </Stack>
        </CardContent>
      </Card>
      {/* {open && (
        <PlayerDialog
          team={isFirstTeam() ? team1 : team2}
          open={open}
          onClose={handleClose}
          title={"Available Players"}
          players={isFirstTeam() ? team1Players : team2Players}
        />
      )} */}
    </div>
  );
}
