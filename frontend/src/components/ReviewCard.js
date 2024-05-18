import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState, useEffect } from "react";
import { red,deepOrange } from "@mui/material/colors";
import axios from "axios";
import { useUser } from "../contexts/UserContext";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Link from 'next/link';
//import AuthorProfile from './AuthorProfile';
import FavoriteCharacters from './FavoriteCharacters';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Avatar, Typography } from '@mui/material';
import UserContributions from "./UserContributions";
import AuthorProfile from './AuthorProfile';



export function ReviewCard({ selectedCharacter }) {
  const [Favorite, setNewFavorite] = useState(false);
  const { user } = useUser();
  //const [showAuthorProfile, setShowAuthorProfile] = useState(false);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/v1/user/${user.userId}/getFavorite`
        );
        if (response.data && response.data.favorites) {
          const isFavorite = response.data.favorites.includes(
            selectedCharacter.id
          );
          setNewFavorite(isFavorite);
        }
      } catch (error) {
        console.error("Error fetching favorite status:", error);
      }
    };

    if (user && user.userId && selectedCharacter && selectedCharacter.id) {
      fetchFavoriteStatus();
    }
  }, [user, selectedCharacter]);

  const handleFavoriteClick = async () => {
    try {
      const requestData = {
        userId: user.userId,
        characterId: selectedCharacter.id,
      };
      if (Favorite) {
        await axios.delete("http://localhost:3001/api/v1/user/deleteFavorite", {
          data: requestData,
        });
        setNewFavorite(false);
      } else {
        await axios.post(
          "http://localhost:3001/api/v1/user/addFavorite",
          requestData
        );
        setNewFavorite(true);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };




  return (
    <Card sx={{ maxWidth: 1045,border: '5px solid #ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {selectedCharacter.authorName ? selectedCharacter.authorName.charAt(0).toUpperCase() : 'N'}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={selectedCharacter.name}
        subheader={selectedCharacter.subtitle}
      /> 
      <CardMedia
        component="img"
        image={selectedCharacter.image_url}
        sx={{
          width: "400px",
          height: "270px",
          objectFit: "cover", // Ensure that the picture is fully displayed while maintaining aspect ratio
          marginLeft: "40px",
          boxShadow:
            "0px 10px 15px rgba(0, 0, 0, 0.2), inset 0 0 10px rgba(0, 0, 0, 0.2)", // Add inner shadow
          borderRadius: "16px",
          border: "1px solid #ddd",
          transition: "transform .2s, boxShadow .2s", // Add a transition effect to the shadow
          "&:hover": {
            transform: "scale(1.1)", // Zoom in when hovering
            boxShadow:
              "0px 15px 20px rgba(0, 0, 0, 0.3), inset 0 0 15px rgba(0, 0, 0, 0.3)", // Change shadow
          },
        }}
        alt={selectedCharacter.id}
      />
      <CardContent>
        <Typography variant="subtitle1" color="text.secondary" sx={{ marginTop: '16px' }}>
          AUTHOR:
        </Typography>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          onClick={handleOpen}
          sx={{
            cursor: 'pointer',
            textDecoration: 'underline',
            display: 'inline'
          }}
        >
          {selectedCharacter.authorName || 'Unknown'}
        </Typography>

        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
        <DialogContent>
          {}
          <AuthorProfile authorName={selectedCharacter.authorName} authorId={selectedCharacter.authorId} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>

        <Typography variant="subtitle1" color="text.secondary" sx={{ marginTop: '16px' }}>
          DESCRIPTION:
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '16px' }}>
          {selectedCharacter.description}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ marginBottom: '12px' }}>
          ATTRIBUTES:
        </Typography>
        <Stack spacing={1} alignItems="left">
          <Stack direction="row" spacing={1}>
            <Chip
              label={`Strength: ${selectedCharacter.strength}`}
              color="primary"
              clickable
            />
            <Chip
              label={`Speed:${selectedCharacter.speed}`}
              color="success"
              clickable
            />
            <Chip
              label={`Skill:${selectedCharacter.skill}`}
              color="primary"
              clickable
            />
            <Chip
              label={`Fear_Factor:${selectedCharacter.fear_factor}`}
              color="success"
              clickable
            />
            <Chip
              label={`Power:${selectedCharacter.power}`}
              color="primary"
              clickable
            />
            <Chip
              label={`Intelligence:${selectedCharacter.intelligence}`}
              color="success"
              clickable
            />
            <Chip
              label={`Wealth:${selectedCharacter.wealth}`}
              color="primary"
              clickable
            />
          </Stack>
        </Stack>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites" onClick={handleFavoriteClick}>
          <FavoriteIcon color={Favorite ? "secondary" : "default"} />
        </IconButton>
      </CardActions>
      {/*showAuthorProfile && <AuthorProfile authorId={selectedCharacter.authorId} />*/}
    </Card>
  );
}
