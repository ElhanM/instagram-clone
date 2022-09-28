import { Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";
import React, { useEffect } from "react";

const ShowPostsComments = ({
  comment,
  setEditCommentMode,
  inputs,
  setInputs,
  post,
  deleteComment,
  setPost,
}) => {
  return (
    <>
      <div className="comments-main-page__flex-post">
        <div className="comments-main-page__flex-post__item-left">
          <Link
            to={`/profile/${comment?.user?._id}`}
            style={{ textDecoration: "none" }}
          >
            <Typography
              variant="span"
              sx={{ fontSize: "1.2rem", paddingTop: "0.2em" }}
            >
              @{comment?.user?.username}:
            </Typography>
          </Link>

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

        <div className="comments-main-page__flex-post__item-right">
          {JSON.parse(localStorage.getItem("user"))._id ===
            comment?.user?._id && (
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
                onClick={() => {
                  deleteComment(post?._id, comment?._id);
                  let foundIndex = post?.comments?.findIndex(
                    (x) => x._id == comment?._id
                  );
                  if (foundIndex !== 0) {
                    let tempComments = [...post?.comments];
                    tempComments.splice(foundIndex, foundIndex);
                    setPost({ ...post, comments: tempComments });
                  } else {
                    setPost({ ...post, comments: [] });
                  }
                }}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default React.memo(
  ShowPostsComments,
  function areEqual(prevProps, nextProps) {
    if (prevProps.post !== nextProps.post) {
      return false;
    }
    return true;
  }
);
