import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { Link } from "react-router-dom";
// import imageUrl from "../../images/cricket.jpg";

export default function CardComponent({ details }) {
  console.log(details);
  const { title, description, image, link, handleClick } = details;
  // const imageUrl = require(image);
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea
        component={link ? Link : null}
        to={link || ""}
        onClick={handleClick}
      >
        {image && (
          <CardMedia
            // style={{ height: "200px", paddingTop: "56.25%" }}
            component="img"
            height="140"
            image={image}
            alt="green iguana"
          />
        )}
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
