import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

export default function RecordStatsList({ list, variant }) {
  //   console.log(list);
  const img = require("../../../../../../images/virat-profile.jpg");

  const generateListItem = ({ name, team, value }, index) => {
    return (
      <>
        <ListItem
          alignItems="flex-start"
          sx={{
            backgroundColor: index === 0 ? "#7fe5ac" : "#dde3e1",
            margin: "5px 0",
            borderRadius: "10px",
          }}
        >
          <ListItemAvatar>
            <Avatar alt="Remy Sharp" src={img} />
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography
                // sx={{ display: "inline" }}
                // component="span"
                variant="subtitle2"
                color="text.primary"
              >
                {name}
              </Typography>
            }
            secondary={
              <React.Fragment>
                <Typography
                  sx={{ display: "inline" }}
                  component="span"
                  variant="caption"
                  color="text.primary"
                >
                  {team}
                </Typography>
              </React.Fragment>
            }
          />
          <ListItemAvatar>
            <Avatar
              variant={variant}
              sx={{
                backgroundColor: index === 0 ? "#1b5945" : "#9da9a5",
                width: variant === "square" ? "70px" : "40px",
              }}
            >
              {value}
            </Avatar>
          </ListItemAvatar>
        </ListItem>
        {/* {index < list.length - 1 && (
          <Divider light={true} variant="inset" component="li" />
        )} */}
      </>
    );
  };
  return (
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      {list.map((details, index) => generateListItem(details, index))}
    </List>
  );
}
