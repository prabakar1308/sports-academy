import * as React from "react";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import { isMobile } from "react-device-detect";

import { getOverBalls } from "../../../utils";
import "./OversDialog.scss";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function OversDialog({
  details: { balls, team, overs },
  handleClose,
}) {
  const maxOver = balls.length > 0 ? Math.max(...balls.map((o) => o.over)) : -1;

  const getOverDetails = (over) => {
    const curBalls = balls
      .filter((b) => b.over === over)
      .sort((a, b) => a.overBallNo - b.overBallNo);
    const bowlerName =
      curBalls && curBalls.length > 0 ? curBalls[0].bowler.name : "";

    // console.log(curBalls.map((b) => b.batsmen.name));
    const batsmen =
      curBalls && curBalls.length > 0
        ? curBalls
            .map((b) => b.batsmen.name)
            .filter((value, index, array) => array.indexOf(value) === index)
            .join(" & ")
        : "";

    const overRuns = curBalls
      .map((item) => {
        if (item.wide || item.noBall) {
          return item.runs + 1;
        }
        return item.runs;
      })
      .reduce((prev, next) => prev + next);

    return (
      <Grid
        container
        spacing={2}
        direction={"row"}
        justifyContent={"flex-start"}
        alignItems={"start"}
        key={`item-${over}`}
        sx={{ overflowX: "auto", overflowY: "hidden", paddingBottom: "10px" }}
      >
        <Grid item sx={{ width: "25%", marginTop: "8px" }}>
          <Tooltip title={bowlerName}>
            <Chip
              sx={{
                width: "100%",
                // marginLeft: "-5px",
                height: "20px",
                backgroundColor: "#1e956d",
                color: "white",
              }}
              label={`${isMobile ? "Over" : "Over"} ${over + 1}`}
            />
          </Tooltip>
          <Typography
            sx={{ fontWeight: "700", paddingLeft: "5px" }}
            variant="caption"
          >
            {overRuns} Runs
          </Typography>
        </Grid>
        <Grid item sx={{ width: "75%" }}>
          <Typography variant="caption" sx={{ fontWeight: "700" }}>
            {bowlerName} to {batsmen}
          </Typography>
          {getOverBalls(curBalls)}
        </Grid>
      </Grid>
    );
  };

  return (
    <Dialog
      fullScreen
      open={true}
      onClose={handleClose}
      TransitionComponent={Transition}
      className="overs-dialog-app-bar"
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {team} - Overs ({overs})
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <div className="overs-dialog-wrapper">
        {[...Array(maxOver + 1)].map((o, index) => {
          return (
            <>
              {getOverDetails(index)}
              {index < maxOver ? <Divider /> : null}
            </>
          );
        })}
      </div>
    </Dialog>
  );
}
