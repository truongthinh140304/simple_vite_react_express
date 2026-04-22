import React from "react";
import { Toolbar, Box } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context";

const Header = () => {
  const navigate = useNavigate();
  const { user, clearAuth } = useAppContext();

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <div>
      <AppBar
        position="static"
        sx={{
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          mb: 4,
        }}
      >
        <Toolbar sx={{ flexWrap: "wrap" }}>
          <Link href="/" color="inherit" style={{ textDecoration: "none" }} sx={{ flexGrow: 8, textAlign: "left" }}>
            <Box display="flex" alignItems="center">
              <img height={40} src="/template-logo.png" alt="logo" />
              <Box ml={1}>simple-vite-react-express</Box>
            </Box>
          </Link>
          <Button component={RouterLink} to="/contacts" color="inherit">
            Contacts
          </Button>
          <Button component={RouterLink} to="/tasks" color="inherit">
            Tasks
          </Button>
          <Button component={RouterLink} to="/projects" color="inherit">
            Projects
          </Button>
          {user ? (
            <>
              <Button color="inherit" sx={{ textTransform: "none" }}>
                {user.name || user.email}
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button component={RouterLink} to="/login" color="inherit">
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
