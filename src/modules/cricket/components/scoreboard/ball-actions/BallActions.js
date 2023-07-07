import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import * as cricketActions from "../../../../../store/actions/cricket";
import PlayerDialog from "../../player-dialog/PlayerDialog";
import WicketDialog from "../wicket-dialog/WicketDialog";
import NewInningsDialog from "../new-innings-dialog/NewInningsDialog";
import EndMatchDialog from "../end-match-dialog/EndMatchDialog";
import { omitProps } from "../../../utils";
import { WICKET_TYPES } from "../../../constants";
import "./BallActions.scss";

// const ball = {
//   ballNo: 1,
//   over: 1,
//   overBallNo: 1,
//   runs: 2,
//   isWide: false,
//   isNoBall: true,
//   hasByes: false,
//   batsmenId: 1,
//   batsmenName: "Virat",
//   bowlerId: 1,
//   bowlerName: "Praba",
//   isWicket: false,
//   wicketHelpedId: 0,
//   wicketHelpedName: "",
//   isRunOut: false,
// };

export default function BallActions({ overDetails }) {
  const details = [0, 1, 2, 3, 4, 5, 6, "W"];
  const [ballNo, setBallNo] = React.useState(1);
  const [over, setOver] = React.useState(0);
  const [overBallNo, setOverBallNO] = React.useState(1);
  const [wide, setWide] = React.useState(false);
  const [noBall, setNoBall] = React.useState(false);
  const [byes, setByes] = React.useState(false);
  const [runout, setRunout] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [batsmenDialog, setBatsmenDialog] = React.useState(false);
  const [isBatsmenRetire, setIsBatsmenRetire] = React.useState(false);
  const [openNewInningsDialog, setOpenNewInningsDialog] = React.useState(false);
  const [endDialog, setEndDialog] = React.useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    scoreboardEntries,
    scoreboard: { isFirstInnings, firstInnings, secondInnings },
    matchDetails: {
      noBallAllowed,
      wideAllowed,
      byesAllowed,
      playersPerTeam,
      overs: totalOvers,
      team1,
      team2,
    },
  } = useSelector((state) => state.cricket);

  const innings = isFirstInnings ? firstInnings : secondInnings;
  const bowlingInnings = isFirstInnings ? secondInnings : firstInnings;

  const {
    batsmen1,
    batsmen2,
    currentBowler,
    balls,
    overs,
    totalRuns,
    wickets,
  } = innings;
  const strikerKey = batsmen1 && batsmen1.isStriker ? "batsmen1" : "batsmen2";
  const nonStrikerKey =
    batsmen1 && batsmen1.isStriker ? "batsmen2" : "batsmen1";

  React.useEffect(() => {
    const { ballNum, overNum, overBallNum } = overs;
    setBallNo(ballNum);
    setOver(overNum);
    setOverBallNO(overBallNum);
  }, [overs]);

  const endMatch = (data) => {
    if (data) {
      setEndDialog(false);
      dispatch(cricketActions.endCricketMatch(data));
      navigate("/cricket/finalscore");
    }
  };

  const startNewInnings = (data) => {
    if (data) {
      setOpenNewInningsDialog(false);
      // dispatch(
      //   cricketActions.updateCurrentBolwer({
      //     bowlerKey: isFirstInnings ? "firstInnings" : "secondInnings",
      //     currentBowler,
      //     newBowler: null,
      //     currentOver: over,
      //   })
      // );
      dispatch(cricketActions.endInnings(data));
    }
  };

  const handleClose = ({ value }) => {
    if (value) {
      setOpenDialog(false);
      dispatch(
        cricketActions.updateCurrentBolwer({
          bowlerKey: isFirstInnings ? "firstInnings" : "secondInnings",
          currentBowler,
          newBowler: value,
          currentOver: over,
        })
      );
    }
  };

  const handleNewBatsmenClose = ({ wicketType, wicketHelpedBy, batsmen }) => {
    let newBatsmenStrike = true;
    if (playersPerTeam === wickets + 1) {
      isFirstInnings ? setOpenNewInningsDialog(true) : setEndDialog(true);
    }
    if (batsmen || wicketType || wicketHelpedBy) {
      setBatsmenDialog(false);
      // const strikerKey = batsmen1 && batsmen1.isStriker ? "batsmen1" : "batsmen2";
      // const nonStrikerKey = batsmen1 && batsmen1.isStriker ? "batsmen2" : "batsmen1";
      const lastBallRun = balls.length > 0 ? balls[balls.length - 1].runs : 0;
      let batsmenKey =
        wicketType && wicketType.value === WICKET_TYPES.RUNOUT_OTHER
          ? nonStrikerKey
          : strikerKey;
      if (runout && lastBallRun % 2 === 0) {
        if (wicketType && wicketType.value === WICKET_TYPES.RUNOUT) {
          batsmenKey = nonStrikerKey;
          newBatsmenStrike = false;
        } else {
          batsmenKey = strikerKey;
          newBatsmenStrike = true;
        }
      } else if (runout && lastBallRun % 2 > 0) {
        if (wicketType && wicketType.value === WICKET_TYPES.RUNOUT) {
          batsmenKey = strikerKey;
          newBatsmenStrike = true;
        } else {
          batsmenKey = nonStrikerKey;
          newBatsmenStrike = false;
        }
      }
      // console.log(playersPerTeam, wickets, playersPerTeam === wickets + 1);
      dispatch(
        cricketActions.updateNewBatsmen({
          inningsKey: isFirstInnings ? "firstInnings" : "secondInnings",
          innings2Key: isFirstInnings ? "secondInnings" : "firstInnings",
          batsmenKey,
          newBatsmen: batsmen ? omitProps("value", batsmen) : null,
          wicketType,
          wicketHelpedBy,
          isBatsmenRetire,
          newBatsmenStrike,
        })
      );
      setRunout(false);
    }
  };

  const runAction = (runs) => {
    dispatch(cricketActions.archiveScoreboard());
    // console.log(runs);
    // if (runs >= 0) {
    const bKey = isFirstInnings ? "firstInnings" : "secondInnings";
    const overLastBall = overBallNo === 6 && !wide && !noBall;
    dispatch(
      cricketActions.addBall({
        bKey,
        bValue: {
          batsmen: batsmen1 && batsmen1.isStriker ? batsmen1 : batsmen2,
          bowler: currentBowler,
          runs: runs === "W" ? 0 : runs,
          ballNo, //
          over,
          overBallNo:
            overBallNo > 1 && (wide || noBall) ? overBallNo - 1 : overBallNo,
          wide,
          noBall,
          byes,
          wicket: runs === "W",
          runout,
          overLastBall,
        },
        strikerKey,
        nonStrikerKey,
        // strikerKey: batsmen1 && batsmen1.isStriker ? "batsmen1" : "batsmen2",
        // nonStrikerKey: batsmen1 && batsmen1.isStriker ? "batsmen2" : "batsmen1",
      })
    );

    if (runs === "W" || runout) setBatsmenDialog(true);

    let overDetails = {
      ballNum: ballNo + 1,
      overNum: over,
      overBallNum: overBallNo,
    };
    // update states
    setBallNo(ballNo + 1);

    // setOverBallNO(overBallNo + 1);
    if (!wide && !noBall) {
      if (overBallNo >= 6) {
        setOver(over + 1);
        setOverBallNO(1);
        overDetails = {
          ...overDetails,
          overNum: over + 1,
          overBallNum: 1,
        };
      } else {
        // console.log("overBallNo", overBallNo);
        setOverBallNO(overBallNo + 1);
        overDetails = {
          ...overDetails,
          overNum: over,
          overBallNum: overBallNo + 1,
        };
      }
    }
    const currInnTotalRuns = runs > 0 ? totalRuns + runs : totalRuns;
    if (overLastBall && totalOvers === overDetails.overNum) {
      // setOpenNewInningsDialog(true);
      isFirstInnings ? setOpenNewInningsDialog(true) : setEndDialog(true);
    } else if (!isFirstInnings && currInnTotalRuns > firstInnings.totalRuns) {
      setEndDialog(true);
    } else if (overLastBall) {
      setOpenDialog(true);
    }
    dispatch(cricketActions.mainOverDetails({ key: bKey, overs: overDetails }));
    resetCheckBoxes();
    // }
  };

  const swapBatsmen = () => {
    dispatch(cricketActions.archiveScoreboard());
    dispatch(
      cricketActions.switchStriker({
        inningsKey: isFirstInnings ? "firstInnings" : "secondInnings",
        strikerKey,
        nonStrikerKey,
        // strikerKey: batsmen1 && batsmen1.isStriker ? "batsmen1" : "batsmen2",
        // nonStrikerKey: batsmen1 && batsmen1.isStriker ? "batsmen2" : "batsmen1",
      })
    );
  };

  const resetCheckBoxes = () => {
    // setRunout(false);
    setWide(false);
    setByes(false);
    setNoBall(false);
  };

  const disableActions = (actions) => {
    let disabled = false;
    if (runout && [4, 5, 6, "W"].includes(actions)) {
      disabled = true;
    }

    if (wide && [6, "W"].includes(actions)) {
      disabled = true;
    }

    if (noBall && ["W"].includes(actions)) {
      disabled = true;
    }

    if (byes && [0, "W"].includes(actions)) {
      disabled = true;
    }

    return disabled;
  };

  return (
    <div className="ball-actions-wrapper">
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
            direction={"column"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Grid item>
              <Stack
                spacing={2}
                direction={{ xs: "column", sm: "row" }}
                justifyContent={"center"}
              >
                <FormGroup
                  row
                  className="form-group-wrapper"
                  sx={{ flexWrap: "wrap", gap: 1 }}
                >
                  {wideAllowed && (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={wide}
                          onChange={(event) => {
                            setWide(event.target.checked);
                          }}
                          color="secondary"
                          disabled={noBall || byes || runout}
                        />
                      }
                      label="Wide"
                    />
                  )}

                  {noBallAllowed && (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={noBall}
                          onChange={(event) => {
                            setNoBall(event.target.checked);
                          }}
                          color="secondary"
                          disabled={wide || runout}
                        />
                      }
                      label="No Ball"
                    />
                  )}

                  {byesAllowed && (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={byes}
                          onChange={(event) => {
                            setByes(event.target.checked);
                          }}
                          color="secondary"
                          disabled={wide || runout}
                        />
                      }
                      label="Byes"
                    />
                  )}

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={runout}
                        onChange={(event) => {
                          setRunout(event.target.checked);
                        }}
                        color="secondary"
                        disabled={noBall || byes || wide}
                      />
                    }
                    label="Runout"
                  />
                </FormGroup>
              </Stack>
            </Grid>
            <Grid item>
              <Stack
                direction="row"
                spacing={1}
                justifyContent={"center"}
                // sx={{ padding: "0 20px", flexWrap: "wrap", gap: 1 }}
                sx={{ flexWrap: "wrap" }}
              >
                {details &&
                  details.map((det) => (
                    <Button
                      variant="text"
                      onClick={() => runAction(det)}
                      disabled={disableActions(det)}
                    >
                      <Avatar
                        className="run-actions"
                        sx={{
                          // width: 0,
                          // height: 30,
                          fontSize: 16,
                          color: "purple",
                          bgcolor: disableActions(det) ? "lightgray" : "white",
                          border: "2px solid purple",
                          cursor: "pointer",
                          ":hover": { background: "lightgray" },
                        }}
                      >
                        {det}
                      </Avatar>
                    </Button>
                  ))}
              </Stack>
            </Grid>
            <Grid item>
              <Stack
                spacing={2}
                direction={{ xs: "column", sm: "row" }}
                sx={{ paddingTop: "16px" }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    setBatsmenDialog(true);
                    setIsBatsmenRetire(true);
                    dispatch(cricketActions.archiveScoreboard());
                  }}
                >
                  Retire
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={swapBatsmen}
                >
                  Swap Batsmen
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => dispatch(cricketActions.undoScoreboard())}
                  disabled={!(scoreboardEntries.length > 1)}
                >
                  Undo
                </Button>
                {/* <Button variant="contained" color="secondary">
                Others
              </Button> */}
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
        {/* <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions> */}
      </Card>
      {openDialog && (
        <PlayerDialog
          team={bowlingInnings?.team}
          open={openDialog}
          onClose={handleClose}
          title={"Select Bowler"}
          currentBowler={currentBowler}
          players={bowlingInnings?.players}
        />
      )}
      {batsmenDialog && (
        <WicketDialog
          team={innings?.team}
          open={batsmenDialog}
          onClose={handleNewBatsmenClose}
          title={"Next Batsmen"}
          players={innings?.players.filter((player) => player.isOut === null)}
          wicket={runout ? WICKET_TYPES.RUNOUT : WICKET_TYPES.CAUGHT}
          bowlers={bowlingInnings?.players}
          isBatsmenRetire={isBatsmenRetire}
          // + 2 - (current wicket + not out batsmen)
          hideNewBatsmen={playersPerTeam === wickets + 1}
        />
      )}
      {openNewInningsDialog && (
        <NewInningsDialog
          open={openNewInningsDialog}
          onClose={startNewInnings}
          players={secondInnings?.players.filter(
            (player) => player.isOut === null
          )}
          bowlers={firstInnings?.players}
          remainingOvers={0}
        />
      )}

      {endDialog && !isFirstInnings && (
        <EndMatchDialog
          open={endDialog}
          onClose={endMatch}
          runMargin={firstInnings.totalRuns - totalRuns}
          remainingwickets={playersPerTeam - wickets - 1}
          remainingOvers={0}
          team1={team1}
          team2={team2}
          allWickets={playersPerTeam === wickets + 1}
        />
      )}
    </div>
  );
}
