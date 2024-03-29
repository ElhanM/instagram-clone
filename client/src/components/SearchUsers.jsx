import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { Link } from "react-router-dom";

const SearchUsers = ({ user, handleSearchClose }) => {
  return (
    <div className="navbar-search__user">
      <div className="navbar-search__user__container__header">
        <div className="navbar-search__user__container__header__left">
          <div className="navbar-search__user__container__header__left__photo">
            <Link to={`/profile/${user?._id}`}>
              <Avatar
                alt={user?.username}
                src={user?.profilePhoto.replace(
                  "/image/upload/c_scale,w_210/",
                  "/image/upload/c_scale,w_120/"
                )}
                sx={{ width: "3rem", height: "3rem" }}
                onClick={() => {
                  handleSearchClose();
                }}
              />
            </Link>
          </div>
          <div className="navbar-search__user__container__header__left__user">
            <Link
              to={`/profile/${user?._id}`}
              onClick={() => {
                handleSearchClose();
              }}
            >
              <Typography variant="h3" sx={{ fontSize: "2rem" }}>
                @{user?.username}
              </Typography>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchUsers;
