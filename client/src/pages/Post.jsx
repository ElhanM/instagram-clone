import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Avatar } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useGlobalContext } from "../components/context";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90vw",
  bgcolor: "#fafafa",
  border: "2px solid #000",
  boxShadow: 24,
  overflow: "auto",
};

const Post = () => {
  const {
    userDispatch,
    userInfo,
    allPosts,
    loading,
    updatePostsDispatch,
    likeURL,
    unlikeURL,
    commentURL,
    handleSubmit,
  } = useGlobalContext();
  const history = useNavigate();
  const { userId, postId } = useParams();
  const [open, setOpen] = useState(true);
  const handleOpen = () => setOpen(true);
  const [post, setPost] = useState({});
  const handleClose = () => {
    setOpen(false);
    history(`/profile/${JSON.parse(localStorage.getItem("user"))._id}`);
  };
  const getPost = async () => {
    try {
      const response = await axios(
        `http://localhost:5000/api/posts/${postId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setPost(response.data.post);
      console.log(response.data.post);
    } catch (error) {
      console.log(error);
    }
  };
  const likeRequest = async (postId) => {
    try {
      const response = await axios.put(
        likeURL,
        { postId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      const updatedPosts = allPosts.map((post) => {
        if (post._id === postId) {
          return { ...post, likes: response.data.likePost.likes };
        } else {
          return post;
        }
      });
      updatePostsDispatch(updatedPosts);
      setPost(response.data.likePost);
    } catch (error) {
      console.log(error);
    }
  };
  const unlikeRequest = async (postId) => {
    try {
      const response = await axios.put(
        unlikeURL,
        { postId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      const updatedPosts = allPosts.map((post) => {
        if (post._id === postId) {
          return { ...post, likes: response.data.unlikePost.likes };
        } else {
          return post;
        }
      });
      updatePostsDispatch(updatedPosts);
      setPost(response.data.unlikePost);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getPost();
  }, []);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="post">
            <div className="post__image">
              <img src={post.photo} alt={post?.description || post?.title} />
            </div>
            <div className="post__info">
              <div className="post__info__user">
                <div className="post__info__user__item">
                  <Avatar
                    alt={post?.user?.username}
                    src="https://img.freepik.com/free-photo/pleasant-looking-serious-man-stands-profile-has-confident-expression-wears-casual-white-t-shirt_273609-16959.jpg?w=2000"
                    sx={{ width: "4rem", height: "4rem" }}
                  />
                </div>
                <div className="post__info__user__item">
                  <Typography variant="h2" sx={{ fontSize: "2rem" }}>
                    {post?.user?.username}
                  </Typography>
                </div>
              </div>
              <div className="post__info__stats">
                <div className="home__container__footer__likes">
                  {post?.likes?.includes(
                    JSON.parse(localStorage.getItem("user"))._id
                  ) ? (
                    <FavoriteIcon
                      onClick={() => {
                        unlikeRequest(postId);
                      }}
                      sx={[
                        {
                          "&:hover": {
                            cursor: "pointer",
                            scale: "1.2",
                          },
                          color: "red",
                        },
                      ]}
                    />
                  ) : (
                    <FavoriteBorderIcon
                      onClick={() => {
                        likeRequest(postId);
                      }}
                      sx={[
                        {
                          "&:hover": {
                            cursor: "pointer",
                            scale: "1.2",
                          },
                        },
                      ]}
                    />
                  )}
                  <Typography
                    variant="h6"
                    sx={{ fontSize: "1.2rem", marginLeft: "0.2em" }}
                  >
                    {post?.likes?.length === 1
                      ? `${post?.likes?.length} like`
                      : `${post?.likes?.length} likes`}
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default Post;
