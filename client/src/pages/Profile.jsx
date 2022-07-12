import { Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";

const Profile = () => {
  return (
    <div className="container">
      <div className="container__header">
        <div className="container__header__profile-photo">
          <Avatar
            alt="John Doe"
            src="https://img.freepik.com/free-photo/pleasant-looking-serious-man-stands-profile-has-confident-expression-wears-casual-white-t-shirt_273609-16959.jpg?w=2000"
            sx={{ width: "13rem", height: "13rem" }}
          />
        </div>
        <div className="container__header__user-info">
          <div className="container__header__user-info__name">
            <Typography variant="h5" sx={{ fontSize: "2.6rem" }}>
              John Doe
            </Typography>
          </div>
          <div className="container__header__user-info__stats">
            <Typography variant="p" sx={{ marginRight: "0.8em" }}>
              9 posts
            </Typography>
            <Typography variant="p" sx={{ marginRight: "0.8em" }}>
              10 followers
            </Typography>
            <Typography variant="p" sx={{ marginRight: "0.8em" }}>
              12 following
            </Typography>
          </div>
        </div>
      </div>
      <div className="container__hr"></div>
      <div className="container__posts">
        <img
          src="https://img.freepik.com/free-photo/pleasant-looking-serious-man-stands-profile-has-confident-expression-wears-casual-white-t-shirt_273609-16959.jpg?w=2000"
          alt=""
        />
        <img
          src="https://img.freepik.com/free-photo/pleasant-looking-serious-man-stands-profile-has-confident-expression-wears-casual-white-t-shirt_273609-16959.jpg?w=2000"
          alt=""
        />
        <img
          src="https://img.freepik.com/free-photo/pleasant-looking-serious-man-stands-profile-has-confident-expression-wears-casual-white-t-shirt_273609-16959.jpg?w=2000"
          alt=""
        />
        <img
          src="https://img.freepik.com/free-photo/pleasant-looking-serious-man-stands-profile-has-confident-expression-wears-casual-white-t-shirt_273609-16959.jpg?w=2000"
          alt=""
        />
        <img
          src="https://img.freepik.com/free-photo/pleasant-looking-serious-man-stands-profile-has-confident-expression-wears-casual-white-t-shirt_273609-16959.jpg?w=2000"
          alt=""
        />
        <img
          src="https://img.freepik.com/free-photo/pleasant-looking-serious-man-stands-profile-has-confident-expression-wears-casual-white-t-shirt_273609-16959.jpg?w=2000"
          alt=""
        />
      </div>
    </div>
  );
};

export default Profile;
