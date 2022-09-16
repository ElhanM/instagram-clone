import { Button, FormControl, TextField, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../components/context";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import ShowPostsComments from "./ShowPostsComments";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Cookies from "universal-cookie";
import { useMemo } from "react";
import React from "react";

const styleLikes = {
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

const ShowPosts = ({
  post,
  unlikeRequest,
  likeRequest,
  editCommentMode,
  inputs,
  setInputs,
  setEditCommentMode,
  handleChange,
}) => {
  const {
    userInfo,
    allPosts,
    handleSubmit,
    deleteComment,
    editComment,
    followRequest,
    postsURL,
    updatePostsDispatch,
    users,
    setUsers,
  } = useGlobalContext();
  const cookies = new Cookies();
  const [allowLike, setAllowLike] = useState(true);
  const [editPostMode, setEditPostMode] = useState(false);

  const [allowFollow, setAllowFollow] = useState(true);

  const [showLikes, setShowLikes] = useState(false);
  const handleOpen = () => setShowLikes(true);
  const handleClose = () => setShowLikes(false);

  const [likedUsers, setLikedUsers] = useState([]);

  const history = useNavigate();

  const editPost = async (postId) => {
    try {
      const response = await axios.patch(
        `${postsURL}/post/${postId}`,
        {
          title: inputs.title,
          description: inputs.description,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.get("authToken")}`,
          },
        }
      );
      const updatedPosts = allPosts?.map((post) => {
        if (post?._id === postId) {
          return response.data.post;
        } else {
          return post;
        }
      });
      updatePostsDispatch(updatedPosts);
    } catch (error) {
      console.log(error);
    }
  };

  const deletePost = async (postId) => {
    try {
      const response = await axios.delete(`${postsURL}/post/${postId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.get("authToken")}`,
        },
      });
      const updatedPosts = allPosts?.map((post) => {
        if (post?._id === postId) {
          return;
        } else {
          return post;
        }
      });
      updatePostsDispatch(updatedPosts);
    } catch (error) {
      console.log(error);
    }
  };

  const content = useMemo(
    () => (
      <>
        <div className="main-page__container">
          <div className="main-page__container__header">
            <div className="main-page__container__header__left">
              <div className="main-page__container__header__left__photo">
                <Link to={`/profile/${post?.user?._id}`}>
                  <Avatar
                    alt={post?.user?.username}
                    src={post?.user?.profilePhoto}
                    sx={{ width: "3rem", height: "3rem" }}
                  />
                </Link>
              </div>
              <div className="main-page__container__header__left__user">
                <Link to={`/profile/${post?.user?._id}`}>
                  <Typography variant="h3" sx={{ fontSize: "2rem" }}>
                    @{post?.user?.username}
                  </Typography>
                </Link>
              </div>
            </div>
            <div className="main-page__container__header__right">
              {JSON.parse(localStorage.getItem("user"))._id ===
                post?.user?._id && (
                <>
                  {editPostMode ? (
                    <CloseIcon
                      sx={[
                        {
                          "&:hover": {
                            cursor: "pointer",
                            scale: "1.2",
                          },
                          fontSize: "1.9rem",
                        },
                      ]}
                      onClick={() => {
                        setEditPostMode((prev) => !prev);
                        setInputs({
                          ...inputs,
                          title: post.title,
                          description: post.description,
                        });
                      }}
                    />
                  ) : (
                    <EditIcon
                      sx={[
                        {
                          "&:hover": {
                            cursor: "pointer",
                            scale: "1.2",
                          },
                          fontSize: "1.9rem",
                        },
                      ]}
                      onClick={() => {
                        setEditPostMode((prev) => !prev);
                        setInputs({
                          ...inputs,
                          title: post.title,
                          description: post.description,
                        });
                      }}
                    />
                  )}

                  <DeleteIcon
                    sx={[
                      {
                        "&:hover": {
                          cursor: "pointer",
                          scale: "1.2",
                        },
                        fontSize: "1.9rem",
                        color: "red",
                      },
                    ]}
                    onClick={() => {
                      deletePost(post?._id);
                    }}
                  />
                </>
              )}
              {JSON.parse(localStorage.getItem("user"))._id !==
                post?.user?._id && (
                <>
                  {post?.user?.followers?.includes(
                    JSON.parse(localStorage.getItem("user"))._id
                  ) ? (
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => {
                        setAllowFollow(true);
                        followRequest(post?.user?._id, allPosts);
                      }}
                      sx={[
                        {
                          "&:hover": {
                            backgroundColor: "#000",
                            color: "#fff",
                          },
                          color: "#000",
                          backgroundColor: "#fff",
                          borderColor: "#000",
                          border: "2px solid #000",
                          transition: "background-color 0.2s ease",
                          height: "2em",
                        },
                      ]}
                    >
                      Unfollow
                    </Button>
                  ) : (
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => {
                        if (allowFollow) {
                          setAllowFollow(false);
                          followRequest(post?.user?._id, allPosts, "follow");
                        }
                      }}
                      sx={[
                        {
                          "&:hover": {
                            backgroundColor: "#000",
                            color: "#fff",
                          },
                          color: "#000",
                          backgroundColor: "#fff",
                          borderColor: "#000",
                          border: "2px solid #000",
                          transition: "background-color 0.2s ease",
                          height: "2em",
                        },
                      ]}
                    >
                      Follow
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="main-page__container__image">
            <Link to={`/profile/${post?.user?._id}/${post?._id}`}>
              <img src={post?.photo} alt={post?.description || post?.title} />
            </Link>
          </div>
          <div className="main-page__container__footer">
            <div className="main-page__container__footer__likes">
              {post?.likes?.includes(userInfo?._id) ? (
                <FavoriteIcon
                  onClick={() => {
                    setAllowLike(true);
                    unlikeRequest(post?._id);
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
                    if (allowLike) {
                      setAllowLike(false);
                      likeRequest(post?._id);
                    }
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
                sx={{
                  fontSize: "1.2rem",
                  marginLeft: "0.2em",
                  cursor: "pointer",
                }}
                onClick={() => {
                  handleOpen();
                  /* // filter users from users with _id of post?.likes
                   */
                  setLikedUsers(
                    post?.likes
                      ?.map((userId) => {
                        return users.find((user) => user._id === userId);
                      })
                      .filter((user) => user)
                  );
                }}
              >
                {post?.likes?.length === 1
                  ? `${post?.likes?.length} like`
                  : `${post?.likes?.length} likes`}
              </Typography>
            </div>
            {editPostMode ? (
              <FormControl
                component="form"
                variant="standard"
                sx={{
                  paddingBottom: "0.4em",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onSubmit={(e) => {
                  e.preventDefault();
                  editPost(post?._id);
                  setEditPostMode((prev) => !prev);
                }}
              >
                <TextField
                  variant="standard"
                  name="title"
                  label="Edit title"
                  id="title"
                  autoComplete="off"
                  value={inputs.title}
                  onChange={handleChange}
                  autoFocus
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
                      width: "80%",
                      marginTop: "1em",
                    },
                  ]}
                />
                <TextField
                  variant="standard"
                  name="description"
                  label="Edit description"
                  id="description"
                  autoComplete="off"
                  value={inputs.description}
                  onChange={handleChange}
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
                      width: "80%",
                      marginTop: "1em",
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
                      width: "8em",
                      // marginRight: "auto",
                    },
                  ]}
                >
                  Save changes
                </Button>
              </FormControl>
            ) : (
              <>
                <Typography variant="h1" sx={{ fontSize: "1.7rem" }}>
                  {post?.title}
                </Typography>
                <Typography variant="h1" sx={{ fontSize: "1.4rem" }}>
                  {post?.description}
                </Typography>
              </>
            )}

            <FormControl
              component="form"
              variant="standard"
              sx={{
                paddingBottom: "0.4em",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(post?._id, e.target[0].value, allPosts);
                e.target[0].value = "";
              }}
            >
              <TextField
                variant="standard"
                required
                name="comment"
                label="Add comment"
                id="comment"
                autoComplete="off"
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
                    width: "3em",
                  },
                ]}
              >
                Add
              </Button>
            </FormControl>

            {editCommentMode && inputs?.editCommentPostId === post?._id ? (
              <FormControl
                component="form"
                variant="standard"
                sx={{
                  paddingBottom: "0.4em",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onSubmit={(e) => {
                  e.preventDefault();
                  editComment(post?._id, inputs, allPosts);
                  setEditCommentMode((prev) => !prev);
                  setInputs({ ...inputs, editCommentPostId: post?._id });
                }}
              >
                <div className="post__edit-comment-flex">
                  <TextField
                    variant="standard"
                    required
                    name="editComment"
                    label="Edit comment"
                    id="editComment"
                    autoComplete="off"
                    value={inputs.editComment}
                    onChange={handleChange}
                    autoFocus
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
                        width: "30em",
                        marginTop: "1em",
                      },
                    ]}
                  />
                  <CloseIcon
                    sx={[
                      {
                        "&:hover": {
                          cursor: "pointer",
                          scale: "1.2",
                        },
                        fontSize: "1.9rem",
                        marginTop: "1em",
                      },
                    ]}
                    onClick={() => {
                      setEditCommentMode((prev) => !prev);
                    }}
                  />
                </div>
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
                      width: "8em",
                    },
                  ]}
                >
                  Save changes
                </Button>
              </FormControl>
            ) : (
              <div className="comments-main-page">
                {post?.comments?.map((comment) => (
                  <ShowPostsComments
                    key={comment?._id}
                    comment={comment}
                    setEditCommentMode={setEditCommentMode}
                    inputs={inputs}
                    setInputs={setInputs}
                    post={post}
                    deleteComment={deleteComment}
                    allPosts={allPosts}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        <Modal
          open={showLikes}
          onClose={() => {
            handleClose();
          }}
          aria-labelledby="modal-modal-title"
          aria-describedbyF="modal-modal-description"
        >
          <Box sx={styleLikes}>
            <div className="show-posts-likes">
              <div className="show-posts-likes__header">
                <CloseIcon
                  className="show-posts-likes__header__close-icon"
                  sx={[
                    {
                      "&:hover": {
                        cursor: "pointer",
                      },
                      fontSize: "2.5rem",
                    },
                  ]}
                  onClick={() => {
                    handleClose();
                  }}
                />
              </div>
              <Typography
                variant="h3"
                sx={{ fontSize: "2rem", marginBottom: "0.5em" }}
              >
                Liked by:
              </Typography>
              {likedUsers.length > 0 ? (
                likedUsers?.map((user, index) => (
                  <div className="show-posts-likes__user">
                    <div className="show-posts-likes__user__container__header">
                      {
                        <div className="show-posts-likes__user__container__header__left">
                          <div className="show-posts-likes__user__container__header__left__photo">
                            <Link
                              to={`/profile/${user?._id}`}
                              onClick={() => {
                                handleClose();
                              }}
                            >
                              <Avatar
                                alt={user?.username}
                                src={user?.profilePhoto}
                                sx={{ width: "3rem", height: "3rem" }}
                              />
                            </Link>
                          </div>
                          <div className="show-posts-likes__user__container__header__left__user">
                            <Link
                              to={`/profile/${user?._id}`}
                              onClick={() => {
                                handleClose();
                              }}
                            >
                              <Typography
                                variant="h3"
                                sx={{ fontSize: "2rem" }}
                              >
                                @{user?.username}
                              </Typography>
                            </Link>
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                ))
              ) : (
                <Typography
                  variant="h3"
                  sx={{
                    fontSize: "2rem",
                    textAlign: "center",
                  }}
                >
                  No users have liked this post yet
                </Typography>
              )}
            </div>
          </Box>
        </Modal>
      </>
    ),
    [post, editCommentMode, handleChange]
  );

  return <>{content}</>;
};

export const MemoShowPosts = React.memo(ShowPosts);
