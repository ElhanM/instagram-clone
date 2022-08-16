import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../components/context";

const Register = () => {
  const history = useNavigate();
  const { cloudinaryRequest, registerURL, setValue } = useGlobalContext();
  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };
  const postRequest = async () => {
    setInputs({
      ...inputs,
      username: inputs?.username?.replace(/\s/g, "").toLowerCase(),
    });
    try {
      const response = await axios.post(
        registerURL,
        { ...inputs, profilePhoto: imageUrl },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      setImageUrl("");
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      history("/");
    } catch (error) {
      console.log(error.response.data.message);
      setErrorMsg(error.response.data.message);
      setImageUrl("");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (image) {
      cloudinaryRequest(image, setImageUrl);
    } else {
      setImageUrl(
        "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"
      );
    }
  };
  useEffect(() => {
    if (imageUrl) {
      postRequest();
    }
  }, [imageUrl]);
  useEffect(() => {
    setValue();
  }, []);
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
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "1em" }}>
          {/* turn errorMsg string into array on , and display ever item*/}
          {errorMsg &&
            errorMsg?.split(",").map((error, index) => (
              <Typography
                key={index}
                variant="h6"
                sx={{ fontWeight: "400", fontSize: "1rem" }}
              >
                {error}
              </Typography>
            ))}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="username"
            label="Username"
            autoFocus
            type="text"
            autoComplete="off"
            value={inputs.username}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            autoComplete="off"
            value={inputs.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={inputs.password}
            onChange={handleChange}
            sx={{
              marginBottom: "1em",
            }}
          />
          <label htmlFor="photo">Choose profile picture: (optional)</label>
          <TextField
            margin="normal"
            fullWidth
            name="photo"
            id="photo"
            type="file"
            autoComplete="off"
            onChange={(e) => setImage(e.target.files[0])}
            sx={[
              {
                "& label.Mui-focused": {
                  color: "#000",
                },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "#000",
                  },
                },
                marginTop: "0.3em",
              },
            ]}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
          <Grid container>
            <Grid item>
              <Link to="/login" variant="body2" className="login-link">
                Already have an account? Login
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
