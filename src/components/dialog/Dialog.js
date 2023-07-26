import * as React from "react";
import PropTypes from "prop-types";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import PersonIcon from "@mui/icons-material/Person";
import Avatar from "@mui/material/Avatar";
import AddIcon from "@mui/icons-material/Add";
import { blue } from "@mui/material/colors";
import { v4 as uuid } from "uuid";

import { Timestamp } from "firebase/firestore/lite";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "./Dialog.scss";

export default function ModalDialog(props) {
  const { onClose, selectedValue, open, title, teams } = props;
  const [isCreate, setIsCreate] = React.useState(false);
  const [name, setName] = React.useState("");
  const [area, setArea] = React.useState("");

  React.useEffect(() => {
    return () => {
      console.log("cleanuped");
    };
  }, []);

  const handleClose = () => {
    onClose({ isNew: false, selectedValue });
  };

  const handleListItemClick = (value) => {
    if (value) {
      onClose({ isNew: false, value });
    } else {
      setIsCreate(true);
    }
  };

  const createNewTeam = () => {
    setIsCreate(false);
    const latestId = Math.max.apply(
      Math,
      teams.map((te) => te.id)
    );
    const client = JSON.parse(sessionStorage.getItem("client"));
    onClose({
      isNew: true,
      value: {
        id: uuid(),
        name,
        area,
        isActive: true,
        created: Date.parse(new Date()) / 1000,
        clientId: client ? client.clientId : 0,
      },
    });
    setArea("");
    setName("");
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>{title}</DialogTitle>
      <List sx={{ pt: 0 }}>
        {teams &&
          teams.map((team) => (
            <ListItem disableGutters key={team.id}>
              <ListItemButton
                onClick={() => handleListItemClick(team)}
                key={team.id}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={team.name} />
              </ListItemButton>
            </ListItem>
          ))}

        <ListItem disableGutters>
          <ListItemButton autoFocus onClick={() => handleListItemClick(null)}>
            <ListItemAvatar>
              <Avatar>
                <AddIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Add New Team" />
          </ListItemButton>
        </ListItem>
      </List>
      {isCreate && (
        <Stack direction="column" spacing={2}>
          <TextField
            id="standard-basic"
            label="Team Name"
            variant="standard"
            required
            value={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
          <TextField
            id="standard-basic"
            label="Locality"
            variant="standard"
            value={area}
            required
            onChange={(event) => {
              setArea(event.target.value);
            }}
          />
          <Button
            variant="outlined"
            onClick={createNewTeam}
            disabled={name.length === 0 || area.length === 0}
          >
            Create
          </Button>
        </Stack>
      )}
    </Dialog>
  );
}

ModalDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.object,
};
