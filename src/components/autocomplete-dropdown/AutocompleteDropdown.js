import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";

const filter = createFilterOptions();

export default function AutocompleteDropdown({
  dropdownOptions,
  handleChange,
  id,
  placeholder,
  width = 200,
}) {
  const [value, setValue] = React.useState(null);

  return (
    <Autocomplete
      //   value={value}
      //   getOptionSelected={(option, value) => option.id === value.id}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onChange={(event, newValue) => {
        if (typeof newValue === "string") {
          handleChange({
            title: newValue,
            id: "",
            name: newValue,
          });
        } else if (newValue && newValue.inputValue) {
          // Create a new value from the user input
          handleChange({
            title: newValue.inputValue,
            id: "",
            name: newValue.inputValue,
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
          filtered.push({
            inputValue,
            title: `Add "${inputValue}"`,
          });
        }

        return filtered;
      }}
      size="small"
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id={id}
      options={dropdownOptions}
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
      renderOption={(props, option) => <li {...props}>{option.title}</li>}
      sx={{ width: width }}
      renderInput={(params) => <TextField {...params} label={placeholder} />}
    />
  );
}
