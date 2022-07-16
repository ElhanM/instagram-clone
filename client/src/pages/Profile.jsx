import { Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../components/context";

const Profile = () => {
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
    <div className="profile">
      <div className="profile-container">
        <div className="profile-container__header">
          <div className="profile-container__header__profile-photo">
            <Avatar
              alt="John Doe"
              src="https://img.freepik.com/free-photo/pleasant-looking-serious-man-stands-profile-has-confident-expression-wears-casual-white-t-shirt_273609-16959.jpg?w=2000"
              sx={{ width: "13rem", height: "13rem" }}
            />
          </div>
          <div className="profile-container__header__user-info">
            <div className="profile-container__header__user-info__name">
              <Typography variant="h5" sx={{ fontSize: "2.6rem" }}>
                John Doe
              </Typography>
            </div>
            <div className="profile-container__header__user-info__stats">
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
        <div className="profile-container__hr"></div>
        <div className="profile-container__posts">
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
    </div>
  );
};

export default Profile;
