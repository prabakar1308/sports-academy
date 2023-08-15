import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { setPlayerForCurrentMatch } from "../../utils";

const filter = createFilterOptions();

export default function AutoCompleteAsync({
  teamId,
  handleChange,
  id,
  placeholder,
  width = 200,
  excludedItems = [],
}) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = open && options.length === 0;

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      const API =
        process.env.REACT_APP_API_URL ||
        "https://nsa-academy-api-dev.onrender.com";
      if (teamId) {
        const response = await axios.get(`${API}/cricket/getPlayers/${teamId}`);
        if (active && response && response.status === 200) {
          if (response.data && response.data.length > 0) {
            setOptions(
              [...response.data].map((pl) => ({
                ...setPlayerForCurrentMatch(pl),
                title: pl.name,
              }))
            );
          } else setOptions([{ id: -1, title: "No Players Available" }]);
        } else {
          setOptions([{ id: -1, title: "Network Error" }]);
        }
      } else {
        const client = JSON.parse(sessionStorage.getItem("client"));
        const response = await axios.get(
          `${API}/cricket/getAllPlayers/${client ? client.clientId : 0}`
        );
        if (active && response && response.status === 200) {
          if (response.data && response.data.length > 0) {
            setOptions(
              [...response.data].map((pl) => ({
                ...pl,
                title: pl.name,
              }))
            );
          } else setOptions([{ id: -1, title: "No Players Available" }]);
        } else {
          setOptions([{ id: -1, title: "Network Error" }]);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      id={id}
      size="small"
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionDisabled={(option) => {
        // console.log(
        //   option,
        //   excludedItems,
        //   excludedItems.filter((item) => item.id === option.id).length > 0
        // );
        return (
          excludedItems.filter((item) => item.id === option.id).length > 0 ||
          option.id === -1
        );
      }}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === "string") {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option.title;
      }}
      options={options}
      loading={loading}
      onChange={(event, newValue) => {
        if (typeof newValue === "string") {
          handleChange({
            title: newValue.trim(),
            id: "",
            name: newValue.trim(),
          });
        } else if (newValue && newValue.inputValue) {
          // Create a new value from the user input
          handleChange({
            title: newValue.inputValue.trim(),
            id: "",
            name: newValue.inputValue.trim(),
          });
        } else {
          handleChange(newValue);
        }
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some(
          (option) => inputValue === option.title
        );
        if (inputValue !== "" && !isExisting) {
          if (teamId) {
            filtered.push({
              inputValue,
              title: `Add "${inputValue}"`,
            });
          } else {
            filtered.push({
              id: -1,
              title: "No Players Available",
            });
          }
        }

        return filtered;
      }}
      sx={{ width: width }}
      renderOption={(props, option) => <li {...props}>{option.title}</li>}
      renderInput={(params) => (
        <TextField
          {...params}
          label={placeholder}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}
