import { FormControl, Input, InputLabel, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../components/context";

const ExplorePage = () => {
  const { userDispatch, userInfo } = useGlobalContext();
  const history = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    userDispatch(user);
    if (!user) {
      history("/login");
    }
  }, []);
  return (
    <div className="explore-page">
      <div className="explore-page__container">
        <div className="explore-page__container__header">
          <div className="explore-page__container__header__photo">
            <Avatar
              alt="John Doe"
              src="https://img.freepik.com/free-photo/pleasant-looking-serious-man-stands-profile-has-confident-expression-wears-casual-white-t-shirt_273609-16959.jpg?w=2000"
              sx={{ width: "3rem", height: "3rem" }}
            />
          </div>
          <div className="explore-page__container__header__user">
            <Typography variant="h2" sx={{ fontSize: "2rem" }}>
              John Doe
            </Typography>
          </div>
        </div>
        <div className="explore-page__container__image">
          <img
            src="https://img.freepik.com/free-photo/pleasant-looking-serious-man-stands-profile-has-confident-expression-wears-casual-white-t-shirt_273609-16959.jpg?w=2000"
            alt=""
          />
        </div>
        <div className="explore-page__container__footer">
          <FavoriteBorderIcon />
          <FavoriteIcon sx={{ color: "red" }} />

          <Typography variant="h1" sx={{ fontSize: "1.7rem" }}>
            John Doe
          </Typography>
          <Typography variant="h1" sx={{ fontSize: "1.4rem" }}>
            John Doe
          </Typography>
          <FormControl variant="standard">
            <InputLabel htmlFor="component-simple">Add comment</InputLabel>
            <Input id="component-simple" />
          </FormControl>
        </div>
      </div>
      <div className="explore-page__container">
        <div className="explore-page__container__header">
          <div className="explore-page__container__header__photo">
            <Avatar
              alt="John Doe"
              src="https://img.freepik.com/free-photo/pleasant-looking-serious-man-stands-profile-has-confident-expression-wears-casual-white-t-shirt_273609-16959.jpg?w=2000"
              sx={{ width: "3rem", height: "3rem" }}
            />
          </div>
          <div className="explore-page__container__header__user">
            <Typography variant="h2" sx={{ fontSize: "2rem" }}>
              John Doe
            </Typography>
          </div>
        </div>
        <div className="explore-page__container__image">
          <img
            src="https://img.freepik.com/free-photo/pleasant-looking-serious-man-stands-profile-has-confident-expression-wears-casual-white-t-shirt_273609-16959.jpg?w=2000"
            alt=""
          />
        </div>
        <div className="explore-page__container__footer">
          <Typography variant="h1" sx={{ fontSize: "1.7rem" }}>
            John Doe
          </Typography>
          <Typography variant="h1" sx={{ fontSize: "1.4rem" }}>
            John Doe
          </Typography>
          <FormControl variant="standard">
            <InputLabel htmlFor="component-simple">Add comment</InputLabel>
            <Input id="component-simple" />
          </FormControl>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
