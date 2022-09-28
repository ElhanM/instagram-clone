import { Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";

const PostComments = ({
  comment,
  setEditCommentMode,
  inputs,
  setInputs,
  deleteComment,
  allPosts,
  postId,
  userId,
  post,
  setPost,
}) => {
  return (
    <div className="comments__flex-post">
      <div className="comments__flex-post__item-left">
        <Link
          to={`/profile/${comment?.user?._id}`}
          style={{ textDecoration: "none" }}
        >
          <Typography
            variant="span"
            sx={{
              fontSize: "1.2rem",
              paddingTop: "0.2em",
              color: "#000",
            }}
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

      <div className="comments__flex-post__item-right">
        {JSON.parse(localStorage.getItem("user"))._id === comment?.user?._id ? (
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
              onClick={() => {
                deleteComment(postId, comment._id);
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
        ) : (
          JSON.parse(localStorage.getItem("user"))._id === userId && (
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
                deleteComment(postId, comment._id);
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
          )
        )}
      </div>
    </div>
  );
};

export default PostComments;
