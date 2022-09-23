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
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/system";
import { Link, NavLink } from "react-router-dom";
import { Tabs, Tab, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import InstagramIcon from "@mui/icons-material/Instagram";
import { useGlobalContext } from "../components/context";
import Modal from "@mui/material/Modal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchUsers from "./SearchUsers";
import CloseIcon from "@mui/icons-material/Close";
import Cookies from "universal-cookie";

const styleDelete = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  width: "80vw",
  maxWidth: "500px",
};

const styleSearch = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  width: "80vw",
  maxWidth: "500px",
  maxHeight: "80vh",
  overflow: "auto",
};

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

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "#fafafa",
  "&:hover": {
    backgroundColor: "#f0f0f0",
  },
  marginLeft: 0,
  width: "auto",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "#000",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      // "&:focus": {
      //   width: "20ch",
      // },
    },
  },
}));

const Navbar = () => {
  const cookies = new Cookies();
  const { userDispatch, userInfo, postsURL, authURL, value, setValue } =
    useGlobalContext();
  const [users, setUsers] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [defaultSearchValue, setDefaultSearchValue] = useState("");

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

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
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const handleDeleteOpen = () => setShowDeleteAccountModal(true);
  const handleDeleteClose = () => setShowDeleteAccountModal(false);

  const [showSearchModal, setShowSearchModal] = useState(false);
  const handleSearchOpen = () => setShowSearchModal(true);
  const handleSearchClose = () => setShowSearchModal(false);

  const history = useNavigate();

  const [tempUsers, setTempUsers] = useState([]);
  useEffect(() => {
    setTempUsers(users);
  }, [users]);

  const handleDeleteAccount = async () => {
    try {
      const removeFollowing = await axios.put(
        `${authURL}/unfollow/all`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.get("authToken")}`,
          },
        }
      );
      const unlikePosts = await axios.put(
        `${postsURL}/unlike/all`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.get("authToken")}`,
          },
        }
      );
      try {
        const deletePosts = await axios.delete(`${postsURL}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.get("authToken")}`,
          },
        });
        const deleteUser = await axios.delete(`${authURL}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.get("authToken")}`,
          },
        });
        cookies.remove("authToken", { path: "/" });
        localStorage.removeItem("user");
        localStorage.removeItem("cookieExpire");
      } catch (error) {
        console.log(error);
      }
      userDispatch(null);
      handleDeleteClose();
      history(`/register`);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const response = await axios.post(
          `${authURL}`,
          { searchValue: searchValue },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setUsers(response?.data?.users);
      } catch (error) {
        console.log(error);
      }
    };
    if (searchValue !== "") {
      getAllUsers();
    } else {
      setUsers([]);
    }
  }, [searchValue]);

  const setSearchValueDebounce = debounce((text) => {
    setSearchValue(text);
  }, 300);

  const [timeoutState, setTimeoutState] = useState();
  function debounce(cb, delay = 1000) {
    return (...args) => {
      clearTimeout(timeoutState);
      setTimeoutState(
        setTimeout(() => {
          cb(...args);
        }, delay)
      );
    };
  }

  useEffect(() => {
    console.log(Object.prototype.toString.call(users) == "[object Array]");
    console.log({ users });
  }, [users]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <AppBar position="sticky" sx={{ borderBottom: "1px solid #dbdbdb" }}>
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Link
                to="/"
                onClick={() => {
                  setValue();
                  window.scrollTo(0, 0);
                }}
                className="navbar-link"
              >
                <InstagramIcon
                  sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
                />
              </Link>

              <Typography
                variant="h5"
                noWrap
                component="a"
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                  flexGrow: 1,

                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                <Link
                  to="/"
                  onClick={() => {
                    setValue();
                    window.scrollTo(0, 0);
                  }}
                  className="navbar-link"
                >
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
                  <div className="navbar-modal">
                    <NavLink
                      to="/create-post"
                      textAlign="center"
                      className="navbar-link"
                      onClick={() => {
                        setValue(0);
                        handleCloseNavMenu();
                      }}
                    >
                      Create Post
                    </NavLink>

                    <NavLink
                      to="/explore"
                      textAlign="center"
                      className="navbar-link"
                      onClick={() => {
                        window.scrollTo(0, 0);
                        setValue(1);
                        handleCloseNavMenu();
                      }}
                    >
                      Explore
                    </NavLink>
                  </div>
                </Menu>
              </Box>
              <Link
                to="/"
                onClick={() => {
                  setValue();
                  window.scrollTo(0, 0);
                }}
                className="navbar-link"
              >
                <InstagramIcon
                  sx={{
                    display: { xs: "flex", md: "none" },
                    mr: 1,
                    "@media (max-width: 600px)": {
                      marginRight: "30vw",
                    },
                  }}
                />
              </Link>

              <Typography
                variant="h5"
                noWrap
                component="a"
                href=""
                sx={{
                  mr: 2,
                  display: { xs: "flex", md: "none" },
                  "@media (max-width: 600px)": {
                    display: "none",
                  },
                  flexGrow: 1,
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                <Link
                  to="/"
                  onClick={() => {
                    setValue();
                    window.scrollTo(0, 0);
                  }}
                  className="navbar-link"
                >
                  INSTAGRAM
                </Link>
              </Typography>
              <Search
                onClick={() => {
                  handleSearchOpen();
                }}
              >
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  value={""}
                  placeholder="Search…"
                  inputProps={{ "aria-label": "search" }}
                  // disabled={true}
                  style={{
                    caretColor: "transparent",
                  }}
                />
              </Search>
              <Modal
                sx={[
                  {
                    // "& .MuiBackdrop-root": {
                    //   backgroundColor: "transparent",
                    // },
                  },
                ]}
                open={showSearchModal}
                onClose={() => {
                  handleSearchClose();
                  setDefaultSearchValue("");
                  setSearchValue("");
                }}
                aria-labelledby="modal-modal-title"
                aria-describedbyF="modal-modal-description"
              >
                <Box sx={styleSearch}>
                  <div className="navbar-search">
                    <div className="navbar-search__header">
                      <TextField
                        variant="standard"
                        required
                        name="search"
                        label="Search users"
                        id="search"
                        autoComplete="off"
                        autoFocus
                        value={defaultSearchValue}
                        onChange={(e) => {
                          setDefaultSearchValue(e.target.value.trim());
                          setSearchValueDebounce(e.target.value.trim());
                        }}
                        sx={[
                          {
                            "& .MuiInput-underline:after": {
                              borderBottomColor: "#000",
                            },
                            "& label.Mui-focused": {
                              color: "#000",
                            },
                            "& .MuiOutlinedInput-root": {
                              "&.Mui-focused fieldset": {
                                borderColor: "#000",
                              },
                            },
                            width: "90%",
                            marginRight: "0.5em",
                            marginBottom: "1em",
                          },
                        ]}
                      />
                      <CloseIcon
                        className="navbar-search__header__close-icon"
                        sx={[
                          {
                            "&:hover": {
                              cursor: "pointer",
                            },
                            fontSize: "2.5rem",
                          },
                        ]}
                        onClick={() => {
                          handleSearchClose();
                          setDefaultSearchValue("");
                          setSearchValue("");
                        }}
                      />
                    </div>
                    {users.length === 0 ? (
                      <Typography variant="h3" sx={{ fontSize: "2rem" }}>
                        Try searching for a user
                      </Typography>
                    ) : (
                      users?.map((user, index) => (
                        <SearchUsers
                          key={user?._id}
                          user={user}
                          handleSearchClose={handleSearchClose}
                        />
                      ))
                    )}
                  </div>
                </Box>
              </Modal>
              <Tabs
                sx={{ ml: "auto", display: { xs: "none", md: "flex" } }}
                textColor="secondary"
                indicatorColor="secondary"
                value={value}
                onChange={(e, val) => {
                  setValue(val);
                  // mui shananigans
                }}
              >
                <Tab
                  LinkComponent={NavLink}
                  to="/create-post"
                  label="Create Post"
                  className="navbar-link"
                  onClick={() => {
                    setValue(0);
                  }}
                />
                <Tab
                  LinkComponent={NavLink}
                  to="/explore"
                  label="Explore"
                  className="navbar-link"
                  onClick={() => {
                    window.scrollTo(0, 0);
                    setValue(1);
                  }}
                />
              </Tabs>
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt={userInfo?.username}
                      src={userInfo?.profilePhoto}
                    />
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
                  <div className="navbar-modal">
                    <NavLink
                      to={`/profile/${
                        JSON.parse(localStorage.getItem("user"))._id
                      }`}
                      textAlign="center"
                      className="navbar-link"
                      onClick={() => {
                        setValue();
                        handleCloseUserMenu();
                      }}
                    >
                      Profile
                    </NavLink>
                    <NavLink
                      to="/login"
                      textAlign="center"
                      className="navbar-link"
                      onClick={() => {
                        setValue();
                        handleCloseUserMenu();
                      }}
                    >
                      Switch Account
                    </NavLink>
                    <Link
                      to="/login"
                      onClick={() => {
                        setValue();
                        handleCloseUserMenu();
                        cookies.remove("authToken", { path: "/" });
                        localStorage.removeItem("user");
                        localStorage.removeItem("cookieExpire");
                        userDispatch(null);
                      }}
                      className="navbar-link"
                    >
                      Log out
                    </Link>
                    <NavLink
                      to={"#"}
                      textAlign="center"
                      className="navbar-link"
                      onClick={() => {
                        setValue();
                        handleCloseUserMenu();
                        handleDeleteOpen();
                      }}
                    >
                      Delete Account
                    </NavLink>
                  </div>
                </Menu>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </ThemeProvider>
      <Modal
        open={showDeleteAccountModal}
        onClose={handleDeleteClose}
        aria-labelledby="modal-modal-title"
        aria-describedbyF="modal-modal-description"
      >
        <Box sx={styleDelete}>
          <div className="delete-acc-modal">
            <div className="delete-acc-modal__header">
              <h2>Are you sure you want to delete your acc?</h2>
            </div>
            <div className="delete-acc-modal__footer">
              <span onClick={handleDeleteAccount}>Yes</span>
              <span onClick={handleDeleteClose}>No</span>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default React.memo(Navbar);
// export const NavbarCom = Navbar;
