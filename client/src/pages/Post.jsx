import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Avatar, FormControl, TextField } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useGlobalContext } from "../components/context";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import PostComments from "../components/PostComments";
import Cookies from "universal-cookie";
import Loading from "../components/Loading";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90vw",
  bgcolor: "#fafafa",
  border: "2px solid #000",
  boxShadow: 24,
  maxHeight: "90vh",
  overflow: "auto",
};

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

const Post = () => {
  const {
    userDispatch,
    likeURL,
    unlikeURL,
    handleSubmit,
    deleteComment,
    editComment,
    postsURL,
    setValue,
    followRequest,
    setRefetchProfile,
    authURL,
  } = useGlobalContext();

  const history = useNavigate();
  const { userId, postId } = useParams();
  const [open, setOpen] = useState(true);
  const [editPostMode, setEditPostMode] = useState(false);
  const [editCommentMode, setEditCommentMode] = useState(false);
  const [allowLike, setAllowLike] = useState(true);
  const cookies = new Cookies();
  const [loadingLikes, setloadingLikes] = useState(false);
  const [allowFollow, setAllowFollow] = useState(true);

  const [showLikes, setShowLikes] = useState(false);
  const handleOpen = () => setShowLikes(true);
  const handleClose = () => setShowLikes(false);
  const [commentsRerender, setCommentsRerender] = useState(true);

  const [likedUsers, setLikedUsers] = useState([]);
  const [post, setPost] = useState({});
  const [refetchPostInitial, setRefetchPostInitial] = useState(true);

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
  const handleCloseEdit = () => {
    setOpen(false);
    history(`/profile/${userId}`);
  };
  const getPost = async () => {
    try {
      const response = await axios(`${postsURL}/post/${postId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const updatedPhoto = response?.data?.post?.photo.replace(
        "/image/upload/c_scale,w_600/",
        "/image/upload/"
      );

      const updateResponse = { ...response.data.post, photo: updatedPhoto };
      return updateResponse;
    } catch (error) {
      console.log(error);
    }
  };
  const { data, isLoading, refetch } = useQuery("post", getPost, {
    suspense: false,
  });
  useEffect(() => {
    setPost(data);
    setRefetchPostInitial(false);
  }, [data]);
  const likeRequest = async (postId) => {
    try {
      const response = await axios.put(
        likeURL,
        { postId },
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
  const [showFollowButton, setShowFollowButton] = useState();
  const [showLike, setShowLike] = useState();
  useEffect(() => {
    setShowFollowButton(
      post?.user?.followers?.includes(
        JSON.parse(localStorage.getItem("user"))._id
      )
    );
    setShowLike(
      post?.likes?.includes(JSON.parse(localStorage.getItem("user"))._id)
    );
  }, [post]);
  const unlikeRequest = async (postId) => {
    try {
      const response = await axios.put(
        unlikeURL,
        { postId },
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
  const deletePost = async () => {
    try {
      const response = await axios.delete(`${postsURL}/post/${postId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.get("authToken")}`,
        },
      });

      history(`/profile/${userId}`);
    } catch (error) {
      console.log(error);
    }
  };
  const editPost = async () => {
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
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    userDispatch(user);
    if (!user) {
      history("/login");
    }
  }, []);
  useEffect(() => {
    setValue();
  }, []);
  useEffect(() => {
    setInputs({
      ...inputs,
      title: post?.title,
      description: post?.description,
    });
  }, [post?.title, post?.description]);
  useEffect(() => {
    setRefetchPostInitial(true);
    refetch();
  }, [postId]);

  return (
    <>
      <div>
        <Modal
          open={open}
          onClose={handleCloseEdit}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <div className="post">
              {isLoading || refetchPostInitial ? (
                <div
                  style={{
                    margin: "20% auto",
                  }}
                >
                  <Loading />
                </div>
              ) : (
                <>
                  <div className="post__image">
                    <img
                      src={post?.photo}
                      alt={post?.description || post?.title}
                    />
                    <CloseIcon
                      className="post__image__close-icon"
                      sx={[
                        {
                          "&:hover": {
                            cursor: "pointer",
                          },
                          fontSize: "2.5rem",
                        },
                      ]}
                      onClick={() => {
                        handleCloseEdit();
                      }}
                    />
                  </div>
                  <div className="post__info">
                    <div className="post__info__user">
                      <div className="post__info__user__user-info">
                        <div className="post__info__user__user-info__item">
                          <Avatar
                            alt={post?.user?.username}
                            src={post?.user?.profilePhoto}
                            sx={{ width: "4rem", height: "4rem" }}
                          />
                        </div>
                        <div className="post__info__user__user-info__item">
                          <Typography variant="h2" sx={{ fontSize: "2rem" }}>
                            @{post?.user?.username}
                          </Typography>
                        </div>
                      </div>
                      <div className="post__info__user__options">
                        {JSON.parse(localStorage.getItem("user"))._id ===
                        userId ? (
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
                              onClick={() => {
                                deletePost();
                                setRefetchProfile(true);
                              }}
                            />
                          </>
                        ) : (
                          <div className="post__info__user__options__follow">
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
                                        transition:
                                          "background-color 0.2s ease",
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
                                        followRequest(
                                          post?.user?._id,
                                          "follow"
                                        );
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
                                        transition:
                                          "background-color 0.2s ease",
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
                        )}
                      </div>
                    </div>

                    <div className="post__info__stats">
                      <div className="post__info__stats__flex">
                        <div className="post__info__stats__flex__likes">
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
                                  setloadingLikes(false);
                                } catch (error) {
                                  console.log(error);
                                }
                              };
                              setloadingLikes(true);
                              getAllUserLikes();
                              handleOpen();
                            }}
                          >
                            {post?.likes?.length === 1
                              ? `${post?.likes?.length} like`
                              : `${post?.likes?.length} likes`}
                          </Typography>
                        </div>
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
                          <Typography
                            variant="h1"
                            sx={{ fontSize: "1.7rem", marginLeft: ".5em" }}
                          >
                            {post?.title}
                          </Typography>
                          <Typography
                            variant="h1"
                            sx={{ fontSize: "1.4rem", marginLeft: ".5em" }}
                          >
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
                          post?.comments?.push({
                            text: e.target[0].value,
                            user: JSON.parse(localStorage.getItem("user")),
                          });
                          setCommentsRerender((prev) => !prev);

                          handleSubmit(postId, inputs.comment, post, setPost);
                          inputs.comment = "";
                        }}
                      >
                        <TextField
                          variant="standard"
                          required
                          name="comment"
                          label="Add a comment"
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
                              marginRight: "1em",
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
                            editComment(postId, inputs);

                            let foundIndex = post?.comments?.findIndex(
                              (x) => x._id === inputs.editCommentId
                            );
                            let tempComments = [...post?.comments];
                            tempComments[foundIndex] = {
                              ...tempComments[foundIndex],
                              text: inputs.editComment,
                            };

                            setPost({ ...post, comments: tempComments });
                            setInputs({
                              ...inputs,
                              editCommentPostId: post?._id,
                            });
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
                                  width: "100%",
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
                        <div className={`comments ${editPostMode && "small"}`}>
                          {post?.comments
                            ?.slice(0)
                            .reverse()
                            .map((comment) => (
                              <PostComments
                                key={comment?._id}
                                comment={comment}
                                unlikeRequest={unlikeRequest}
                                likeRequest={likeRequest}
                                editCommentMode={editCommentMode}
                                inputs={inputs}
                                setInputs={setInputs}
                                setEditCommentMode={setEditCommentMode}
                                handleChange={handleChange}
                                postId={postId}
                                userId={userId}
                                deleteComment={deleteComment}
                                post={post}
                                setPost={setPost}
                              />
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </Box>
        </Modal>
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
            {loadingLikes ? (
              <Loading />
            ) : likedUsers?.length > 0 ? (
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
                            <Typography variant="h3" sx={{ fontSize: "2rem" }}>
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
  );
};

export default Post;
