import * as React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { v4 as uuid } from "uuid";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CircularProgress } from "@mui/material";

import * as genericActions from "../../../store/actions/dashboard";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" to="/cricket">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

export default function ClientRegistration() {
  const dispatch = useDispatch();
  const [formData, setFormData] = React.useState({
    phone: "",
    clientName: "",
    pin: "",
    userPin: "",
  });
  const [formError, setFormError] = React.useState({
    phone: "",
    clientName: "",
    pin: "",
    userPin: "",
  });
  const [formLoading, setFormLoading] = React.useState({
    phone: false,
    clientName: false,
    pin: false,
    userPin: false,
  });

  const handleText = (text) => {
    let tx = text.trim().toLowerCase().replaceAll(/\s/g, "_");
    const clientId = `${tx}_${parseInt(Math.random() * 1000)}`;
    const algoliaIndex = `${tx}_players`;
    return { clientId, algoliaIndex };
  };
  const handleSubmit = (event) => {
    event.preventDefault();

    const { phone, clientName, pin, userPin } = formData;
    const phoneError = handleLocalValidation("phone", phone);
    const nameError = handleLocalValidation("clientName", clientName);
    const pinError = handleLocalValidation("pin", pin);
    const userPinError = handleLocalValidation("userPin", userPin);

    if (
      !formError.phone &&
      !formError.clientName &&
      !formError.pin &&
      !formError.userPin &&
      !phoneError &&
      !nameError &&
      !pinError &&
      !userPinError
    ) {
      const { clientId, algoliaIndex } = handleText(clientName);
      const data = {
        phone,
        clientName,
        pin,
        userPin,
        validity: Date.parse(new Date("12/31/2023")) / 1000,
        clientId,
        algoliaIndex,
        id: uuid(),
        status: "approved",
      };
      dispatch(genericActions.registerClient(data));
    }
  };

  const handleChange = (value, key) => {
    setFormData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
    setFormError((prevState) => ({
      ...prevState,
      [key]: "",
    }));
  };

  const handleLocalValidation = (key, value) => {
    let error = false;
    if (value.trim() === "") {
      setFormError((prevError) => ({
        ...prevError,
        [key]: "This field is required!",
      }));
      error = true;
    } else if (key === "phone" && !/^[6789]\d{9}$/.test(value)) {
      setFormError((prevError) => ({
        ...prevError,
        [key]: "This field is not valid!",
      }));
      error = true;
    }
    return error;
  };

  const handleValidationAsync = async (event, key) => {
    event.preventDefault();
    const value = event.target.value;
    const error = handleLocalValidation(key, value);
    if (!error) {
      const API =
        process.env.REACT_APP_API_URL ||
        "https://nsa-academy-api-dev.onrender.com";
      setFormLoading((prev) => ({
        ...prev,
        [key]: true,
      }));
      const response = await axios.post(`${API}/register/validate`, {
        key,
        value,
      });
      if (response && response.status === 200) {
        if (response.data) {
          setFormError((prevError) => ({
            ...prevError,
            [key]: response.data.valid ? "" : `${key} is already exists!`,
          }));

          setFormLoading((prev) => ({
            ...prev,
            [key]: false,
          }));
        }
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3, gap: 2 }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  value={formData.phone}
                  type="number"
                  error={formError.phone}
                  helperText={formError.phone}
                  name="phoneNumber"
                  required
                  fullWidth
                  size="small"
                  id="phoneNumber"
                  label="Mobile Number"
                  onChange={(e) => handleChange(e.target.value, "phone")}
                  onBlur={(e) => handleValidationAsync(e, "phone")}
                  InputProps={{
                    readOnly: formLoading.phone,
                    endAdornment: (
                      <React.Fragment>
                        {formLoading.phone ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                      </React.Fragment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  value={formData.clientName}
                  type="text"
                  error={formError.clientName}
                  helperText={formError.clientName}
                  name="clientName"
                  required
                  fullWidth
                  size="small"
                  id="clientName"
                  label="Club Name"
                  onChange={(e) => handleChange(e.target.value, "clientName")}
                  // onBlur={(e) => handleValidationAsync(e, "clientName")}
                  // InputProps={{
                  //   readOnly: formLoading.clientName,
                  //   endAdornment: (
                  //     <React.Fragment>
                  //       {formLoading.clientName ? (
                  //         <CircularProgress color="inherit" size={20} />
                  //       ) : null}
                  //     </React.Fragment>
                  //   ),
                  // }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  value={formData.pin}
                  type="number"
                  error={formError.pin}
                  helperText={formError.pin}
                  required
                  fullWidth
                  size="small"
                  id="pin"
                  label="Admin Pin"
                  name="pin"
                  onChange={(e) => handleChange(e.target.value, "pin")}
                  // onBlur={(e) => handleValidationAsync(e, "pin")}
                  // InputProps={{
                  //   readOnly: formLoading.pin,
                  //   endAdornment: (
                  //     <React.Fragment>
                  //       {formLoading.pin ? (
                  //         <CircularProgress color="inherit" size={20} />
                  //       ) : null}
                  //     </React.Fragment>
                  //   ),
                  // }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  value={formData.userPin}
                  type="number"
                  error={formError.userPin}
                  helperText={formError.userPin}
                  required
                  fullWidth
                  size="small"
                  id="userPin"
                  label="User Pin"
                  name="userPin"
                  onChange={(e) => handleChange(e.target.value, "userPin")}
                  // onBlur={(e) => handleValidationAsync(e, "userPin")}
                  // InputProps={{
                  //   readOnly: formLoading.userPin,
                  //   endAdornment: (
                  //     <React.Fragment>
                  //       {formLoading.userPin ? (
                  //         <CircularProgress color="inherit" size={20} />
                  //       ) : null}
                  //     </React.Fragment>
                  //   ),
                  // }}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={
                formLoading.clientName ||
                formLoading.phone ||
                formLoading.pin ||
                formLoading.userPin
              }
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
