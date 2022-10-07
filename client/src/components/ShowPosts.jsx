import { Button, FormControl, TextField, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../components/context";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Cookies from "universal-cookie";
import { useMemo } from "react";
import React, { Suspense, lazy } from "react";
import Loading from "./Loading";

const ShowPostsComments = lazy(() => import("./ShowPostsComments"));

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
  mapPost,
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
    handleSubmit,
    deleteComment,
    editComment,
    followRequest,
    postsURL,
    users,
    authURL,
  } = useGlobalContext();
  const [removed, setRemoved] = useState(false);
  const [post, setPost] = useState(mapPost);
  const [commentsRerender, setCommentsRerender] = useState(true);
  const cookies = new Cookies();
  const [allowLike, setAllowLike] = useState(true);
  const [editPostMode, setEditPostMode] = useState(false);
  const [loading, setLoading] = useState(false);
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
    } catch (error) {
      console.log(error);
    }
  };

  const [showFollowButton, setShowFollowButton] = useState(
    post?.user?.followers?.includes(
      JSON.parse(localStorage.getItem("user"))._id
    )
  );
  const [showLike, setShowLike] = useState(
    post?.likes?.includes(JSON.parse(localStorage.getItem("user"))._id)
  );
  useEffect(() => {
    console.log({ likedUsers });
  }, [likedUsers]);

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
                    // the link I get from the backend is a string, so it does not matter which quality is specified in it
                    // what matters is which quality is displayed
                    src={post?.user?.profilePhoto.replace(
                      "/image/upload/c_scale,w_210/",
                      "/image/upload/c_scale,w_120/"
                    )}
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
                      setRemoved(true);
                      deletePost(post?._id);
                    }}
                  />
                </>
              )}
              {JSON.parse(localStorage.getItem("user"))._id !==
                post?.user?._id && (
                <>
                  {showFollowButton ? (
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => {
                        setShowFollowButton(false);
                        setAllowFollow(true);
                        followRequest(post?.user?._id);
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
                          setShowFollowButton(true);

                          setAllowFollow(false);
                          followRequest(post?.user?._id, "follow");
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
              <img
                src={post?.photo}
                // // does not work on deployed website
                // srcset={`${post?.photo.replace(
                //   "/image/upload/c_scale,w_600/",
                //   "/image/upload/c_scale,w_400/"
                // )} 400w,
                // ${post?.photo.replace(
                //   "/image/upload/c_scale,w_600/",
                //   "/image/upload/c_scale,w_500/"
                // )} 500w,
                // ${post?.photo} 600w`}
                // // my image container is always as big as the image rezolution so i do not need media queries for sizes
                // // e.g. if my picture with 600px width was shrunk and displayed in a 400px width container i would use media queries
                // // to instead render the 400px width picture
                // sizes="100vw"
                alt={post?.description || post?.title}
              />
            </Link>
          </div>
          <div className="main-page__container__footer">
            <div className="main-page__container__footer__likes">
              {showLike ? (
                <FavoriteIcon
                  onClick={() => {
                    setAllowLike(true);
                    setShowLike(false);
                    post?.likes?.pop();
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
                      setShowLike(true);
                      post?.likes?.push(
                        JSON.parse(localStorage.getItem("user"))._id
                      );
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
                  const getAllUserLikes = async () => {
                    try {
                      const response = await axios.post(
                        `${authURL}/user-likes`,
                        { users: post?.likes },
                        {
                          headers: {
                            "Content-Type": "application/json",
                          },
                        }
                      );
                      setLikedUsers(response?.data?.users);
                      setLoading(false);
                    } catch (error) {
                      console.log(error);
                    }
                  };
                  setLoading(true);
                  getAllUserLikes();
                  handleOpen();
                  /* // filter users from users with _id of post?.likes
                   */
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
                  setPost({
                    ...post,
                    title: inputs.title,
                    description: inputs.description,
                  });
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
                console.log("post", e.target[0].value);
                post?.comments?.push({
                  text: e.target[0].value,
                  user: JSON.parse(localStorage.getItem("user")),
                });

                setCommentsRerender((prev) => !prev);
                handleSubmit(post?._id, e.target[0].value, post, setPost);
                e.target[0].value = "";
              }}
            >
              <TextField
                variant="standard"
                required
                name="comment"
                label="Add a comment"
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
                  editComment(post?._id, inputs);
                  let foundIndex = post?.comments?.findIndex(
                    (x) => x._id == inputs.editCommentId
                  );
                  let tempComments = [...post?.comments];
                  tempComments[foundIndex] = {
                    ...tempComments[foundIndex],
                    text: inputs.editComment,
                  };

                  setPost({ ...post, comments: tempComments });
                  setInputs({ ...inputs, editCommentPostId: post?._id });
                  setEditCommentMode((prev) => !prev);
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
                <Suspense fallback={<Loading />}>
                  {post?.comments
                    ?.slice(0)
                    .reverse()
                    .map((comment) => (
                      <ShowPostsComments
                        key={comment?._id}
                        comment={comment}
                        setEditCommentMode={setEditCommentMode}
                        inputs={inputs}
                        setInputs={setInputs}
                        post={post}
                        setPost={setPost}
                        deleteComment={deleteComment}
                      />
                    ))}
                </Suspense>
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
              {loading ? (
                <Loading />
              ) : likedUsers.length > 0 ? (
                likedUsers
                  ?.slice(0)
                  .reverse()
                  .map((user, index) => (
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
                                  src={user?.profilePhoto.replace(
                                    "/image/upload/c_scale,w_210/",
                                    "/image/upload/c_scale,w_120/"
                                  )}
                                  sx={{ width: "4rem", height: "4rem" }}
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
    [
      post,
      editCommentMode,
      handleChange,
      showLikes,
      likedUsers,
      showLike,
      showFollowButton,
      commentsRerender,
    ]
  );
  if (removed) return;

  return <>{content}</>;
};

export const MemoShowPosts = React.memo(
  ShowPosts,
  function areEqual(prevProps, nextProps) {
    if (
      prevProps.editCommentMode !== nextProps.editCommentMode ||
      prevProps.handleChange !== nextProps.handleChange
    ) {
      return false;
    }
    return true;
  }
);
