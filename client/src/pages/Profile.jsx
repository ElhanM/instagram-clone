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
  } = useGlobalContext();
  const history = useNavigate();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState([]);
  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showChangePhoto, setShowChangePhoto] = useState(false);
  const handleOpen = () => setShowChangePhoto(true);
  const handleClose = () => setShowChangePhoto(false);
  const axiosGetUser = async () => {
    try {
      // dispatch({ type: "LOADING" });
      const response = await axios(`${authURL}/${userId}`, {
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
    cloudinaryRequest(image, setImageUrl);
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
                  src={
                    user[0]?.profilePhoto ||
                    "https://thumbs.dreamstime.com/b/default-avatar-profile-image-vector-social-media-user-icon-potrait-182347582.jpg"
                  }
                  sx={{ width: "13rem", height: "13rem" }}
                />
                {user[0]?._id ===
                JSON.parse(localStorage.getItem("user"))._id ? (
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
                ) : null}
              </div>
              <div className="profile__container__header__user-info">
                <div className="profile__container__header__user-info__name">
                  <Typography variant="h5" sx={{ fontSize: "2.6rem" }}>
                    {user[0]?.username}
                  </Typography>
                </div>
                <div className="profile__container__header__user-info__stats">
                  <Typography variant="p" sx={{ marginRight: "0.8em" }}>
                    {posts?.length} posts
                  </Typography>
                  <Typography variant="p" sx={{ marginRight: "0.8em" }}>
                    10 followers
                  </Typography>
                  <Typography variant="p" sx={{ marginRight: "0.8em" }}>
                    12 following
                  </Typography>
                </div>
              </div>
            </div>
            <div className="profile__container__hr"></div>
            <div className="profile__container__posts">
              {posts
                ?.slice(0)
                .reverse()
                .map((post) => (
                  <Link to={`/profile/${post?.user?._id}/${post?._id}`}>
                    <img
                      src={post?.photo}
                      alt={post?.description || post?.title}
                    />
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>
      <div>
        <Modal
          open={showChangePhoto}
          onClose={handleClose}
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
              <label htmlFor="photo">Choose profile picture: (optional)</label>
              <TextField
                margin="normal"
                required
                fullWidth
                name="photo"
                id="photo"
                type="file"
                autoComplete="off"
                onChange={(e) => setImage(e.target.files[0])}
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
                    marginTop: "0.3em",
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
