import { Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const ShowPostsComments = ({
  comment,
  setEditCommentMode,
  inputs,
  setInputs,
  post,
  deleteComment,
  allPosts,
}) => {
  return (
    <div className="comments-main-page__flex-post">
      <div className="comments-main-page__flex-post__item-left">
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
              onClick={() => deleteComment(post?._id, comment?._id, allPosts)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ShowPostsComments;
