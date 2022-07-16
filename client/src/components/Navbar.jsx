import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/system";
import { Link, NavLink } from "react-router-dom";
import { Tabs, Tab } from "@mui/material";
import { useState } from "react";
import InstagramIcon from "@mui/icons-material/Instagram";
import { useGlobalContext } from "../components/context";

const theme = createTheme({
  palette: {
    primary: {
      main: "#fff",
    },
    secondary: {
      main: "#000",
    },
  },
});

const Navbar = () => {
  const { userDispatch, userInfo } = useGlobalContext();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [value, setValue] = useState();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" sx={{ borderBottom: "1px solid #dbdbdb" }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <InstagramIcon
              sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
            />
            <Typography
              variant="h6"
              noWrap
              component="a"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <Link to="/" onClick={() => setValue()} className="navbar-link">
                INSTAGRAM
              </Link>
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                <MenuItem
                  onClick={handleCloseNavMenu}
                  sx={[
                    {
                      "&:hover": {
                        backgroundColor: "#f0f0f0",
                      },
                      transition: "background-color 0.2s ease",
                    },
                  ]}
                >
                  <NavLink
                    to="/create-post"
                    textAlign="center"
                    className="navbar-link"
                    onClick={() => setValue(0)}
                  >
                    Create Post
                  </NavLink>
                </MenuItem>
                <MenuItem
                  onClick={handleCloseNavMenu}
                  sx={[
                    {
                      "&:hover": {
                        backgroundColor: "#f0f0f0",
                      },
                      transition: "background-color 0.2s ease",
                    },
                  ]}
                >
                  <NavLink
                    to="/explore"
                    textAlign="center"
                    className="navbar-link"
                    onClick={() => setValue(1)}
                  >
                    Explore
                  </NavLink>
                </MenuItem>
              </Menu>
            </Box>
            <InstagramIcon
              sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
            />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href=""
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              INSTAGRAM
            </Typography>
            <Tabs
              sx={{ ml: "auto", display: { xs: "none", md: "flex" } }}
              textColor="secondary"
              indicatorColor="secondary"
              value={value}
              onChange={(e, val) => {
                console.log(val);
                setValue(val);
                // mui shananigans
              }}
            >
              <Tab
                LinkComponent={NavLink}
                to="/create-post"
                label="Create Post"
                className="navbar-link"
              />
              <Tab
                LinkComponent={NavLink}
                to="/explore"
                label="Explore"
                className="navbar-link"
              />
            </Tabs>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem
                  onClick={handleCloseUserMenu}
                  sx={[
                    {
                      "&:hover": {
                        backgroundColor: "#f0f0f0",
                      },
                      transition: "background-color 0.2s ease",
                    },
                  ]}
                >
                  <NavLink
                    to="/profile"
                    textAlign="center"
                    className="navbar-link"
                    onClick={() => setValue()}
                  >
                    Profile
                  </NavLink>
                </MenuItem>
                <MenuItem
                  onClick={handleCloseUserMenu}
                  sx={[
                    {
                      "&:hover": {
                        backgroundColor: "#f0f0f0",
                      },
                      transition: "background-color 0.2s ease",
                    },
                  ]}
                >
                  <Typography
                    textAlign="center"
                    onClick={() => {
                      // remove authToken and user from localStorage
                      localStorage.removeItem("authToken");
                      localStorage.removeItem("user");
                      userDispatch(null);
                    }}
                  >
                    <Link
                      to="/login"
                      onClick={() => setValue()}
                      className="navbar-link"
                    >
                      Log out
                    </Link>
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
};
export default Navbar;
