import { FormControl, Input, InputLabel, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const Home = () => {
  return (
    <div className="home">
      <div className="home-container">
        <div className="home-container__header">
          <div className="home-container__header__photo">
            <Avatar
              alt="John Doe"
              src="https://img.freepik.com/free-photo/pleasant-looking-serious-man-stands-profile-has-confident-expression-wears-casual-white-t-shirt_273609-16959.jpg?w=2000"
              sx={{ width: "3rem", height: "3rem" }}
            />
          </div>
          <div className="home-container__header__user">
            <Typography variant="h2" sx={{ fontSize: "2rem" }}>
              John Doe
            </Typography>
          </div>
        </div>
        <div className="home-container__image">
          <img
            src="https://img.freepik.com/free-photo/pleasant-looking-serious-man-stands-profile-has-confident-expression-wears-casual-white-t-shirt_273609-16959.jpg?w=2000"
            alt=""
          />
        </div>
        <div className="home-container__footer">
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
      <div className="home-container">
        <div className="home-container__header">
          <div className="home-container__header__photo">
            <Avatar
              alt="John Doe"
              src="https://img.freepik.com/free-photo/pleasant-looking-serious-man-stands-profile-has-confident-expression-wears-casual-white-t-shirt_273609-16959.jpg?w=2000"
              sx={{ width: "3rem", height: "3rem" }}
            />
          </div>
          <div className="home-container__header__user">
            <Typography variant="h2" sx={{ fontSize: "2rem" }}>
              John Doe
            </Typography>
          </div>
        </div>
        <div className="home-container__image">
          <img
            src="https://img.freepik.com/free-photo/pleasant-looking-serious-man-stands-profile-has-confident-expression-wears-casual-white-t-shirt_273609-16959.jpg?w=2000"
            alt=""
          />
        </div>
        <div className="home-container__footer">
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

export default Home;
