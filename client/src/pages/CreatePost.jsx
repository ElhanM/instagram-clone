import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../components/context";

const CLOUDINARYURL =
  "https://api.cloudinary.com/v1_1/instagram-clone-web-app/image/upload";
const URL = "http://localhost:5000/api/posts";

const Login = () => {
  const history = useNavigate();
  const { userDispatch, userInfo } = useGlobalContext();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    userDispatch(user);
    if (!user) {
      history("/login");
    }
  }, []);
  const [inputs, setInputs] = useState({
    title: "",
    description: "",
  });
  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const handleChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const cloudinaryRequest = async () => {
    try {
      const data = new FormData();
      // data.append("title", inputs.title);
      // data.append("description", inputs.description);
      data.append("file", image);
      data.append("upload_preset", "instagram-clone");
      data.append("cloud_name", "instagram-clone-web-app");

      const response = await axios.post(CLOUDINARYURL, data);
      setImageUrl(response.data.url);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const postRequest = async () => {
    try {
      const response = await axios.post(
        URL,
        { ...inputs, photo: imageUrl },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      console.log(response.data);
      history("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (imageUrl) {
      postRequest();
    }
  }, [imageUrl]);

  const handleSubmit = (event) => {
    event.preventDefault();
    cloudinaryRequest();
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Create Post
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="title"
            label="Title"
            id="title"
            autoFocus
            autoComplete="off"
            value={inputs.title}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="description"
            label="Description"
            id="description"
            autoComplete="off"
            value={inputs.description}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="photo"
            id="photo"
            type="file"
            autoComplete="off"
            onChange={(e) => setImage(e.target.files[0])}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Create
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
