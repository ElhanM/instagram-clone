import { Typography } from "@mui/material";
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
  const { userDispatch, allPosts, loading, authURL } = useGlobalContext();
  const history = useNavigate();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState([]);
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
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Text in a modal
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </Typography>
          </Box>
        </Modal>
      </div>
      <Outlet />
    </>
  );
};

export default Profile;
