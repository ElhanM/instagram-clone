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
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../components/context";
import { useEffect } from "react";
import Cookies from "universal-cookie";

const Login = () => {
  const cookies = new Cookies();
  const { userDispatch, loginURL, setValue } = useGlobalContext();
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    userDispatch(user);
  }, []);
  const history = useNavigate();
  const [inputs, setInputs] = useState({
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
    try {
      const response = await axios.post(
        loginURL,
        { ...inputs },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem(
        "cookieExpire",
        JSON.stringify(new Date().setDate(new Date().getDate() + 28))
      );
      cookies.set("authToken", response.data.token, {
        path: "/",
        maxAge: 2592000,
        secure: true,
        sameSite: "none",
      });
      userDispatch(response.data.user);
      history("/");
    } catch (error) {
      setErrorMsg(error.response.data.message);
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    postRequest();
  };

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
          Login
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "1em" }}>
          {/* turn errorMsg string into array on , and display ever item*/}
          {errorMsg &&
            errorMsg?.split(",").map((error, index) => (
              <Typography
                key={error}
                variant="h6"
                sx={{
                  fontWeight: "400",
                  fontSize: "1rem",
                  backgroundColor: "#f6d9d8",
                  padding: "0.5em 1em",
                }}
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
            label="Email"
            name="email"
            autoFocus
            autoComplete="off"
            type="text"
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
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
          <Grid container>
            <Grid item>
              <Link to="/register" variant="body2" className="login-link">
                Don't have an account? Register
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
