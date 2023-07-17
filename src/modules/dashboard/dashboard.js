import * as React from "react";
import ToggleButtons from "../../components/toggleButton/ToggleButton";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";

const cardList = [
  {
    id: "ipl-2023",
    value: "IPL 2023",
  },
  {
    id: "kcc-06-2023",
    value: "KCC Test",
  },
  {
    id: "kcc-07-2023",
    value: "KCC",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  // sessionStorage.setItem(
  //   "client",
  //   JSON.stringify({ clientId: "ipl-2023", clientName: "KCC", validity: "" })
  // );
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "50px",
      }}
    >
      <Typography variant="button">Select Client:</Typography>
      <br />
      <ToggleButtons
        id="client-ids"
        items={cardList}
        value={null}
        handleSelection={({ id, value }) => {
          sessionStorage.setItem(
            "client",
            JSON.stringify({
              clientId: id,
              clientName: value,
              validity: "",
            })
          );
          navigate("/cricket");
        }}
      />
    </div>
  );
};

export default Dashboard;
