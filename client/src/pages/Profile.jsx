import { TextField, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../components/context";
import axios from "axios";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  width: "80vw",
  maxWidth: "500px",
};

const Profile = () => {
  const { userId } = useParams();
  const {
    userDispatch,
    allPosts,
    loading,
    authURL,
    userInfo,
    updatePostsDispatch,
    cloudinaryRequest,
    setValue,
  } = useGlobalContext();
  const history = useNavigate();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState([]);
  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showChangePhoto, setShowChangePhoto] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleOpen = () => setShowChangePhoto(true);
  const handleClose = () => setShowChangePhoto(false);
  const axiosGetUser = async () => {
    try {
      // dispatch({ type: "LOADING" });
      const response = await axios(`${authURL}/user/${userId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const {
        data: { user },
      } = response;
      setUser(user);
      // dispatch({ type: "GET_POSTS", payload: posts });
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    if (image) {
      cloudinaryRequest(image, setImageUrl);
    } else {
      setErrorMsg("Please provide an image");
    }
  };
  const changeProfilePictureRequest = async () => {
    try {
      const response = await axios.patch(
        authURL,
        { profilePhoto: imageUrl },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      const tempPosts = [...allPosts, response.data.changeProfilePhoto];
      updatePostsDispatch(tempPosts);
      userDispatch(response.data.changeProfilePhoto);
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.changeProfilePhoto)
      );
    } catch (error) {
      console.log(error);
      setErrorMsg("Please provide an image");
    }
  };
  useEffect(() => {
    if (imageUrl) {
      changeProfilePictureRequest();
    }
    handleClose();
  }, [imageUrl]);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    axiosGetUser();
    userDispatch(user);
    setPosts(
      allPosts?.filter((post) => {
        return post?.user?._id === userId;
      })
    );
    if (!user) {
      history("/login");
    }
  }, [allPosts, userId]);
  useEffect(() => {
    setValue();
  }, []);
  return (
    <>
      <div className="profile">
        {loading ? (
          <h1>Loading...</h1>
        ) : posts === [] ? (
          <h1>No posts to display </h1>
        ) : (
          <div className="profile__container">
            <div className="profile__container__header">
              <div className="profile__container__header__profile-photo">
                <Avatar
                  alt={user[0]?.username}
                  src={user[0]?.profilePhoto}
                  sx={{ width: "13rem", height: "13rem" }}
                />
                {user[0]?._id ===
                  JSON.parse(localStorage.getItem("user"))._id && (
                  <div
                    className="profile__container__header__profile-photo__overlay"
                    onClick={() => {
                      console.log("showChangePhoto", showChangePhoto);
                      handleOpen();
                    }}
                  >
                    <span className="profile__container__header__profile-photo__overlay__text">
                      Change photo
                    </span>
                  </div>
                )}
              </div>
              <div className="profile__container__header__user-info">
                <div className="profile__container__header__user-info__name">
                  <Typography variant="h5" sx={{ fontSize: "2.6rem" }}>
                    @{user[0]?.username}
                  </Typography>
                </div>
                <div className="profile__container__header__user-info__stats">
                  <Typography variant="p" sx={{ marginRight: "0.8em" }}>
                    {posts?.length} posts
                  </Typography>
                  <Typography variant="p" sx={{ marginRight: "0.8em" }}>
                    {user[0]?.followers?.length} followers
                  </Typography>
                  <Typography variant="p" sx={{ marginRight: "0.8em" }}>
                    {user[0]?.following?.length} following
                  </Typography>
                </div>
              </div>
            </div>
            <div className="profile__container__hr"></div>
            {posts.length > 0 ? (
              <div className="profile__container__posts">
                {posts
                  ?.slice(0)
                  .reverse()
                  .map((post, index) => (
                    <Link
                      key={index}
                      to={`/profile/${post?.user?._id}/${post?._id}`}
                    >
                      <img
                        src={post?.photo}
                        alt={post?.description || post?.title}
                      />
                    </Link>
                  ))}
              </div>
            ) : (
              <Typography
                variant="h3"
                sx={{
                  // center
                  textAlign: "center",
                }}
              >
                No posts to display
              </Typography>
            )}
          </div>
        )}
      </div>
      <div>
        <Modal
          open={showChangePhoto}
          onClose={() => {
            handleClose();
            setErrorMsg("");
          }}
          aria-labelledby="modal-modal-title"
          aria-describedbyF="modal-modal-description"
        >
          <Box sx={style}>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              {errorMsg &&
                errorMsg?.split(",").map((error, index) => (
                  <Typography
                    key={index}
                    variant="h6"
                    sx={{
                      fontWeight: "400",
                      fontSize: "1rem",
                      backgroundColor: "#f6d9d8",
                      padding: "0.5em 1em",
                      marginBottom: "1em",
                    }}
                  >
                    {error}
                  </Typography>
                ))}
              <label htmlFor="photo">Choose new profile picture:</label>
              <TextField
                margin="normal"
                required
                fullWidth
                name="photo"
                id="photo"
                type="file"
                autoComplete="off"
                // value={image}
                onChange={(e) => {
                  if (e?.target?.files[0]?.type?.includes("image")) {
                    setImage(e?.target?.files[0]);
                  } else {
                    setErrorMsg("Please provide an image");
                    e.target.value = null;
                  }
                }}
                sx={[
                  {
                    "& label.Mui-focused": {
                      color: "#000",
                    },
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: "#000",
                      },
                    },
                  },
                ]}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={[
                  {
                    "&:hover": {
                      backgroundColor: "#000",
                      color: "#fff",
                    },
                    mt: 3,
                    mb: 2,
                    color: "#000",
                    backgroundColor: "#fff",
                    borderColor: "#000",
                    border: "2px solid #000",
                    transition: "background-color 0.2s ease",
                  },
                ]}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Modal>
      </div>
      <Outlet />
    </>
  );
};

export default Profile;
