import React, { useState } from "react";
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Grid,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import HistoryIcon from "@mui/icons-material/History";
import SettingsIcon from "@mui/icons-material/Settings";
import ChatIcon from "@mui/icons-material/Chat";

const Sidebar = ({ onSent, prevPrompts, setRecentPrompt, newChat }) => {
  const [extended, setExtended] = useState(false);

  const loadPreviousPrompt = async (prompt) => {
    setRecentPrompt(prompt);
    await onSent(prompt);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#f0f4f9",
        padding: "10px 15px",
      }}
    >
      <Box sx={{ marginTop: "15px" }}>
        <IconButton
          onClick={() => setExtended(!extended)}
          sx={{ marginLeft: "10px" }}
        >
          <MenuIcon />
        </IconButton>
        <Box
          sx={{
            marginTop: "50px",
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 15px",
            backgroundColor: "#e6eaf1",
            borderRadius: "50px",
            fontSize: "14px",
            color: "grey",
            cursor: "pointer",
          }}
          onClick={newChat}
        >
          <IconButton>
            <AddIcon />
          </IconButton>
          {extended && <Typography variant="body1">New Chat</Typography>}
        </Box>
        {extended && (
          <List sx={{ animation: "fadeIn 2.0s" }}>
            <Typography
              variant="h6"
              sx={{ marginTop: "30px", marginBottom: "20px" }}
            >
              Recent
            </Typography>
            {prevPrompts.map((item, index) => (
              <ListItem
                button
                key={index}
                onClick={() => loadPreviousPrompt(item)}
                sx={{
                  display: "flex",
                  alignItems: "start",
                  gap: "10px",
                  padding: "10px",
                  paddingRight: "40px",
                  borderRadius: "50px",
                  color: "#282828",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#e2e6eb",
                  },
                }}
              >
                <ListItemIcon>
                  <ChatIcon />
                </ListItemIcon>
                <ListItemText primary={`${item.slice(0, 18)}...`} />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
      <Box>
        <List>
          <ListItem button>
            <ListItemIcon>
              <HelpOutlineIcon />
            </ListItemIcon>
            {extended && <ListItemText primary="Help" />}
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <HistoryIcon />
            </ListItemIcon>
            {extended && <ListItemText primary="Activity" />}
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            {extended && <ListItemText primary="Settings" />}
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};

export default Sidebar;
