import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import DeleteIcon from "@mui/icons-material/Delete";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import * as genericActions from "../../../store/actions/dashboard";
import ConfirmationDialog from "../../../components/confirmation-dialog/ConfirmationDialog";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Clients() {
  const [clientId, setClientId] = React.useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    loginStatus: { success, fail },
    roles: { isSuperAdmin, isAdmin },
    clients = [],
  } = useSelector((state) => state.dashboard);

  const currentClient = sessionStorage.getItem("client");
  let selectedClient = null;
  if (currentClient) {
    selectedClient = JSON.parse(currentClient);
  }

  const handleDelete = () => {
    dispatch(genericActions.deleteClient(clientId));
    setClientId("");
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <AppBar position="relative" sx={{ backgroundColor: "cadetblue" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* <CameraIcon sx={{ mr: 2 }} /> */}
          <Typography variant="h6" color="inherit" noWrap>
            Selected Client:{" "}
            <strong>{selectedClient ? selectedClient.clientName : ""}</strong>
          </Typography>
          {isAdmin && <AccountCircleIcon />}
        </Toolbar>
      </AppBar>
      <main>
        <Container sx={{ py: 8 }} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {clients.map((client) => (
              <Grid
                item
                key={client.clientId}
                xs={12}
                sm={6}
                md={4}
                sx={{ margin: "0 50px" }}
              >
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      // 16:9
                      pt: "56.25%",
                    }}
                    image={require("../../../images/cricket-team.jpg")}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {client.clientName}
                    </Typography>
                    <Typography>
                      Valid upto:{" "}
                      <strong>
                        {new Date(client.validity * 1000).toDateString()}
                      </strong>
                    </Typography>
                    {isSuperAdmin && (
                      <Typography variant="caption">
                        Phone: <strong>{client.phone}</strong>
                        <br />
                        Admin pin: <strong>{client.pin}</strong> <br /> User
                        pin: <strong>{client.userPin}</strong>
                        <br />
                        Algolia Index: <strong>{client.algoliaIndex}</strong>
                      </Typography>
                    )}
                    {isAdmin && !isSuperAdmin && (
                      <Typography variant="caption">
                        User pin: <strong>{client.userPin}</strong>
                      </Typography>
                    )}
                  </CardContent>
                  {isSuperAdmin && (
                    <CardActions
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "-25px",
                      }}
                    >
                      <IconButton
                        size="large"
                        onClick={() => {
                          sessionStorage.setItem(
                            "client",
                            JSON.stringify(client)
                          );
                          navigate("/cricket");
                        }}
                      >
                        <ExitToAppIcon />
                      </IconButton>
                      <IconButton
                        onClick={(event) => {
                          event.stopPropagation();
                          setClientId(client.id);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
      {clientId && (
        <ConfirmationDialog
          title={"Delete Client"}
          actionBtnText={"Delete"}
          handleClose={handleDelete}
          confirmationText={"Do you really want to delete the client?"}
        />
      )}
    </ThemeProvider>
  );
}
