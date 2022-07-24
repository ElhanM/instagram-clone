import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Avatar } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: '90vw',
  bgcolor: "#fafafa",
  border: "2px solid #000",
  boxShadow: 24,
  overflow: "auto",
};

const Post = () => {
  const history = useNavigate();
  const { postId } = useParams();
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
              <div className="post__info__stats"></div>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default Post;
