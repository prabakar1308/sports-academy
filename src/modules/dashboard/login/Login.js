import * as React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import * as genericActions from "../../../store/actions/dashboard";
import { IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link to="/cricket">Your Website</Link> {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function LoginPage({ handleLogin }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [pin, setPin] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [phone, setPhone] = React.useState("");
  const [disableBtn, setDisableBtn] = React.useState(false);
  const {
    loginStatus: { success, fail },
    roles: { isSuperAdmin },
  } = useSelector((state) => state.dashboard);

  React.useEffect(() => {
    if (success) {
      isSuperAdmin ? navigate("/") : navigate("/cricket");
    }
  }, [success]);

  React.useEffect(() => {
    if (fail) {
      setDisableBtn(true);
    }
  }, [fail]);

  // React.useEffect(() => {
  //   const userDetails = sessionStorage.getItem("userDetails");
  //   if (userDetails) {
  //     dispatch(genericActions.validateLoginSuccess(JSON.parse(userDetails)));
  //   }
  // }, []);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // const data = new FormData(event.currentTarget);
    // handleLogin(data.get("pin"));
    dispatch(genericActions.validateLogin({ pin, phone }));
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            // backgroundImage: "url(../../images/Virat.jpg)",
            backgroundImage:
              "url(https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/a78b5f27464719.563658bc4756d.jpg)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                value={phone}
                type="number"
                margin="normal"
                required
                fullWidth
                id="phone"
                label="Enter phone number"
                name="phone"
                error={fail && disableBtn}
                autoComplete="tel"
                // helperText={fail && disableBtn ? fail : ""}
                // autoComplete="email"
                autoFocus
                onChange={(event) => {
                  setDisableBtn(true);
                  setPhone(event.target.value);
                  if (event.target.value.trim().length > 0)
                    setDisableBtn(false);
                }}
              />
              <TextField
                value={pin}
                type={showPassword ? "text" : "password"}
                margin="normal"
                required
                fullWidth
                id="pin"
                label="Enter a pin"
                name="pin"
                error={fail && disableBtn}
                helperText={fail && disableBtn ? fail : ""}
                onChange={(event) => {
                  setDisableBtn(true);
                  setPin(event.target.value);
                  if (event.target.value.trim().length > 0)
                    setDisableBtn(false);
                }}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  ),
                }}
              />
              <Button
                disabled={disableBtn}
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                {/* <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid> */}
                <Grid item>
                  <Link to="/register">{"Don't have an account? Sign Up"}</Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
