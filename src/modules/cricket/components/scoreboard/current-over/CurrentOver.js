import * as React from "react";
import { useSelector } from "react-redux";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Badge from "@mui/material/Badge";
import { Grid } from "@mui/material";

export default function CurrentOver({ overDetails }) {
  const details = ["0", "6", "4", "3", "W", "4"];

  const {
    scoreboard: { isFirstInnings, firstInnings, secondInnings },
  } = useSelector((state) => state.cricket);

  const innings = isFirstInnings ? firstInnings : secondInnings;

  const { balls = [], currentOver } = innings;

  const curBalls = balls
    .filter((b) => b.over === currentOver)
    .sort((a, b) => a.overBallNo - b.overBallNo);

  // console.log("curBalls", curBalls, balls, currentOver);

  const currentValue = ({ runs, wicket, runout, wide, noBall }) => {
    let value = runs;
    if (wicket || runout) value = "W";
    // else if (wide) value = "WD";
    // else if (noBall) value = "NB"
    return value;
  };

  const getBadge = ({ runs, wicket, runout, wide, noBall, byes }) => {
    let value = runs;
    let color = "warning";
    if (wide) value = "WD";
    else if (noBall) value = "NB";
    else if (byes) {
      value = "B";
      color = "secondary";
    }
    return wicket || runout || wide || noBall || byes ? (
      <Badge badgeContent={value} color={color}></Badge>
    ) : null;
  };

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent
        sx={{
          backgroundImage: "linear-gradient(#c6d5e7, #84dfad)",
          paddingBottom: "16px",
        }}
      >
        {/* <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Word of the Day
        </Typography> */}
        <Grid
          container
          spacing={2}
          direction={"row"}
          justifyContent={"flex-start"}
          alignItems={"start"}
        >
          <Grid item>
            <Typography variant="h6" component="div">
              This Over: <br />
            </Typography>
          </Grid>
          <Grid item>
            <Stack direction="row" spacing={window.innerWidth <= 768 ? 0 : 2}>
              {curBalls &&
                curBalls.map((det, index) => {
                  const { wicket, runout, runs, wide, noBall } = det;
                  const isWicket = det?.wicket;
                  return (
                    <div key={index}>
                      <Avatar
                        sx={{
                          width: 30,
                          height: 30,
                          fontSize: 12,
                          color: "black",
                          bgcolor: () => {
                            if (wicket || runout) return "lightcoral";
                            else if (runs && (runs === 4 || runs === 6))
                              return "lightgreen";
                            else return "white";
                          },
                          border: "2px solid lightgray",
                        }}
                      >
                        {currentValue(det)}
                      </Avatar>
                      {getBadge(det)}
                    </div>
                  );
                })}
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
      {/* <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions> */}
    </Card>
  );
}
