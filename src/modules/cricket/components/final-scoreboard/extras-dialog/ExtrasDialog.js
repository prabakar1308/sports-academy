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

import "./ExtrasDialog.scss";
import { Avatar } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ExtrasDialog({
  details: { balls, team, bowlers, currentBowler },
  handleClose,
}) {
  console.log(balls, team, bowlers, currentBowler);
  const updatedBowlers = [...bowlers];
  const currBowExists = updatedBowlers.findIndex(
    (bow) => bow.id === currentBowler.id
  );

  if (currBowExists > -1) {
    updatedBowlers.splice(currBowExists, 1, currentBowler);
  } else updatedBowlers.push(currentBowler);

  const getExtras = (bowler) => {
    let wide = 0,
      noBall = 0;
    const filteredBalls = balls.filter((b) => b.bowler.id === bowler.id);
    filteredBalls.forEach((ball) => {
      if (ball.wide) {
        wide = wide + 1 + ball.runs;
      } else if (ball.noBall) {
        noBall = noBall + 1;
      }
    });
    return `${wide + noBall} (${wide} WD, ${noBall} NB)`;
  };

  const getExtraDetails = (bowler, index) => {
    // const curBalls = balls
    //   .filter((b) => b.over === over)
    //   .sort((a, b) => a.overBallNo - b.overBallNo);
    // const bowlerName =
    //   curBalls && curBalls.length > 0 ? curBalls[0].bowler.name : "";

    return (
      <Grid
        container
        spacing={2}
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"start"}
        key={`item-${index}`}
        sx={{ overflowX: "auto", overflowY: "hidden" }}
      >
        <Grid item sx={{ width: "50%" }}>
          <Chip
            avatar={<Avatar>{bowler.name.charAt(0).toUpperCase()}</Avatar>}
            label={bowler.name}
          />
        </Grid>
        <Grid
          item
          sx={{
            width: "50%",
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "5px",
          }}
        >
          <Typography variant="button">{getExtras(bowler)}</Typography>
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
      className="extras-dialog-app-bar"
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {team.name} - Extras
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
      <div className="extras-dialog-wrapper">
        {updatedBowlers.map((bowler, index) => {
          return (
            <>
              {getExtraDetails(bowler, index)}
              {index < updatedBowlers.length - 1 ? <Divider /> : null}
            </>
          );
        })}
      </div>
    </Dialog>
  );
}
