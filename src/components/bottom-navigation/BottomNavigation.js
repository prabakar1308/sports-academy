import * as React from "react";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
import RestoreIcon from "@mui/icons-material/Restore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useNavigate } from "react-router-dom";
import ConfirmationDialog from "../confirmation-dialog/ConfirmationDialog";

export default function BottomNavigationMenu({
  navigationItems,
  unSavedChanges,
}) {
  const [value, setValue] = React.useState(navigationItems[0]);
  const [confirm, setConfirm] = React.useState(null);
  const navigate = useNavigate();

  return (
    <Paper
      sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
      elevation={3}
    >
      {/* <Box sx={{ width: 500 }}> */}
      <BottomNavigation
        sx={{ backgroundColor: "#d0e6e7" }}
        showLabels
        value={value}
        onChange={(event, newValue) => {
          console.log(newValue);
          setValue(newValue);
          if (unSavedChanges) setConfirm(newValue.path);
          else navigate(newValue.path);
        }}
      >
        {navigationItems.map((item) => (
          <BottomNavigationAction
            label={item.label}
            value={item}
            icon={item.icon}
          />
        ))}
      </BottomNavigation>
      {/* </Box> */}
      {confirm && (
        <ConfirmationDialog
          title={"Unsaved Changes"}
          actionBtnText={"Continue"}
          handleClose={(res) => {
            setConfirm(null);
            if (res) navigate(confirm);
            else setValue(null);
          }}
          confirmationText={"Do you really want to move away?"}
        />
      )}
    </Paper>
  );
}
