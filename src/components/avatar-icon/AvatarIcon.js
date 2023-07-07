import * as React from "react";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import BlockIcon from "@mui/icons-material/Block";

export default function AvatarIcon({ icon, tooltip, handleClick }) {
  return (
    <Avatar sx={{ bgcolor: "AppWorkspace" }}>
      <Tooltip title={tooltip}>
        <IconButton size="small" color="primary" onClick={handleClick}>
          {icon}
        </IconButton>
      </Tooltip>
    </Avatar>
  );
}
