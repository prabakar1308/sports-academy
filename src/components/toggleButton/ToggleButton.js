import * as React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

export default function ToggleButtons({ value, items, handleSelection, id }) {
  const [selectedValue, setSelectedValue] = React.useState(value);

  React.useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const onChange = (event, selectedItem) => {
    setSelectedValue(selectedItem);
    handleSelection(selectedItem);
  };

  return (
    <ToggleButtonGroup
      // value={selectedValue}
      exclusive
      onChange={onChange}
      aria-label={id}
      size="small"
      color="primary"
      sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}
      key={id}
    >
      {items &&
        items.map((item, index) => (
          <ToggleButton
            value={item}
            selected={selectedValue && selectedValue.id === item.id}
            aria-label={id}
            key={index}
            disabled={item.disabled}
            sx={{
              borderLeft: "1px solid rgba(0, 0, 0, 0.12) !important",
              textTransform: "capitalize",
            }}
          >
            {item.value}
          </ToggleButton>
        ))}
    </ToggleButtonGroup>
  );
}
