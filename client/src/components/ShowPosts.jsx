import { Button, FormControl, TextField, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../components/context";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

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
  } = useGlobalContext();
  const [allowLike, setAllowLike] = useState(true);
  return (
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
                {post?.user?.username}
              </Typography>
            </Link>
          </div>
        </div>
        <div className="main-page__container__header__right">
          {post?.user?.followers?.includes(
            JSON.parse(localStorage.getItem("user"))._id
          ) ? (
            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                followRequest(post?.user?._id, post?._id, allPosts);
              }}
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
                followRequest(post?.user?._id, post?._id, allPosts, "follow");
              }}
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
                  height: "2em",
                },
              ]}
            >
              Follow
            </Button>
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
            sx={{ fontSize: "1.2rem", marginLeft: "0.2em" }}
          >
            {post?.likes?.length === 1
              ? `${post?.likes?.length} like`
              : `${post?.likes?.length} likes`}
          </Typography>
        </div>
        <Typography variant="h1" sx={{ fontSize: "1.7rem" }}>
          {post?.title}
        </Typography>
        <Typography variant="h1" sx={{ fontSize: "1.4rem" }}>
          {post?.description}
        </Typography>
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
                            editCommentPostId: post?._id,
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
                          deleteComment(post?._id, comment?._id, allPosts)
                        }
                      />
                    </>
                  ) : null}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default ShowPosts;
