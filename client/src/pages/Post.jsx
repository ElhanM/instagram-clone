import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Avatar, FormControl, TextField } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useGlobalContext } from "../components/context";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";

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
  maxHeight: "90vh",
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
    deleteComment,
    editComment,
    postsURL,
  } = useGlobalContext();
  const history = useNavigate();
  const { userId, postId } = useParams();
  const [open, setOpen] = useState(true);
  const handleOpen = () => setOpen(true);
  const [post, setPost] = useState({});
  const [editPostMode, setEditPostMode] = useState(false);
  const [editCommentMode, setEditCommentMode] = useState(false);
  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    comment: "",
    editComment: "",
    editCommentId: "",
  });
  const handleChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };
  const handleClose = () => {
    setOpen(false);
    history(`/profile/${userId}`);
  };
  const getPost = async () => {
    try {
      const response = await axios(`${postsURL}/${postId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setPost(response.data.post);
      setInputs({
        ...inputs,
        title: response.data.post.title,
        description: response.data.post.description,
      });
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
        if (post?._id === postId) {
          return { ...post, likes: response?.data?.likePost?.likes };
        } else {
          return post;
        }
      });
      updatePostsDispatch(updatedPosts);
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
        if (post?._id === postId) {
          return { ...post, likes: response?.data?.unlikePost?.likes };
        } else {
          return post;
        }
      });
      updatePostsDispatch(updatedPosts);
    } catch (error) {
      console.log(error);
    }
  };
  const deletePost = async () => {
    try {
      const response = await axios.delete(`${postsURL}/${postId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
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
      history(`/profile/${userId}`);
    } catch (error) {
      console.log(error);
    }
  };
  const editPost = async () => {
    try {
      const response = await axios.patch(
        `${postsURL}/${postId}`,
        {
          title: inputs.title,
          description: inputs.description,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
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

  useEffect(() => {
    getPost();
  }, [allPosts]);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    userDispatch(user);
    console.log("app.jsx useEffect");
    if (!user) {
      history("/login");
    }
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
                <div className="post__info__user__user-info">
                  <div className="post__info__user__user-info__item">
                    <Avatar
                      alt={post?.user?.username}
                      src="https://img.freepik.com/free-photo/pleasant-looking-serious-man-stands-profile-has-confident-expression-wears-casual-white-t-shirt_273609-16959.jpg?w=2000"
                      sx={{ width: "4rem", height: "4rem" }}
                    />
                  </div>
                  <div className="post__info__user__user-info__item">
                    <Typography variant="h2" sx={{ fontSize: "2rem" }}>
                      {post?.user?.username}
                    </Typography>
                  </div>
                </div>
                <div className="post__info__user__options">
                  {JSON.parse(localStorage.getItem("user"))._id === userId ? (
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
                          onClick={() => setEditPostMode((prev) => !prev)}
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
                        onClick={deletePost}
                      />
                    </>
                  ) : null}
                </div>
              </div>

              <div className="post__info__stats">
                <div className="post__info__stats__likes">
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
                          marginLeft: "0.5em",
                        },
                      ]}
                    />
                  ) : (
                    ("Post",
                    (
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
                            marginLeft: "0.5em",
                          },
                        ]}
                      />
                    ))
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
                      editPost();
                      setEditPostMode((prev) => !prev);
                    }}
                  >
                    <TextField
                      variant="standard"
                      required
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
                      required
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
                    <Typography
                      variant="h1"
                      sx={{ fontSize: "1.7rem", marginLeft: ".5em" }}
                    >
                      {post.title}
                    </Typography>
                    <Typography
                      variant="h1"
                      sx={{ fontSize: "1.4rem", marginLeft: ".5em" }}
                    >
                      {post.description}
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
                    handleSubmit(postId, inputs.comment, allPosts);
                    inputs.comment = "";
                  }}
                >
                  <TextField
                    variant="standard"
                    required
                    name="comment"
                    label="Add comment"
                    id="comment"
                    autoComplete="off"
                    value={inputs.comment}
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
                        marginLeft: "0.5em",
                        marginRight: "1em",
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
                        marginRight: "auto",
                      },
                    ]}
                  >
                    Post
                  </Button>
                </FormControl>
                {editCommentMode ? (
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
                      editComment(postId, inputs, allPosts);
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
                  <>
                    {post?.comments?.map((comment) => (
                      <div className="comments-flex-post">
                        <div className="comments-flex-post__item-left">
                          <Typography
                            variant="span"
                            sx={{ fontSize: "1.2rem", paddingTop: "0.2em" }}
                          >
                            {comment?.user?.username}:
                          </Typography>
                          <Typography
                            variant="span"
                            sx={{
                              fontSize: "1.2rem",
                              paddingTop: "0.2em",
                              ml: "0.2em",
                              fontWeight: "light",
                            }}
                          >
                            {comment?.text}
                          </Typography>
                        </div>

                        <div className="comments-flex-post__item-right">
                          {JSON.parse(localStorage.getItem("user"))._id ===
                          comment?.user?._id ? (
                            <>
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
                                  setEditCommentMode((prev) => !prev);
                                  setInputs({
                                    ...inputs,
                                    editComment: comment?.text,
                                    editCommentId: comment?._id,
                                  });
                                }}
                              />
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
                                onClick={() =>
                                  deleteComment(postId, comment._id, allPosts)
                                }
                              />
                            </>
                          ) : JSON.parse(localStorage.getItem("user"))._id ===
                            userId ? (
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
                              onClick={() =>
                                deleteComment(postId, comment._id, allPosts)
                              }
                            />
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default Post;
