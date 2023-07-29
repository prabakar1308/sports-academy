import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import CameraIcon from "@mui/icons-material/PhotoCamera";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Clients() {
  const navigate = useNavigate();
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
        {/* Hero unit */}
        {/* <Box
          sx={{
            bgcolor: "background.paper",
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Album layout
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="text.secondary"
              paragraph
            >
              Something short and leading about the collection below—its
              contents, the creator, etc. Make it short and sweet, but not too
              short so folks don&apos;t simply skip over it entirely.
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Button variant="contained">Main call to action</Button>
              <Button variant="outlined">Secondary action</Button>
            </Stack>
          </Container>
        </Box> */}
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
                        Admin pin: <strong>{client.pin}</strong> <br /> User
                        pin: <strong>{client.userPin}</strong>
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
                    </CardActions>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      {/* <Box sx={{ bgcolor: "background.paper", p: 6 }} component="footer">
        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Something here to give the footer a purpose!
        </Typography>
        <Copyright />
      </Box> */}
      {/* End footer */}
    </ThemeProvider>
  );
}
