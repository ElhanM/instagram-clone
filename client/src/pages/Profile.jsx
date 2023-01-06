import { TextField, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useGlobalContext } from "../components/context";
import axios from "axios";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import Cookies from "universal-cookie";
import Loading from "../components/Loading";
import { useInfiniteQuery } from "react-query";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  width: "80vw",
  maxWidth: "500px",
};

const styleFollowersAndFollowing = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  width: "80vw",
  maxWidth: "500px",
  maxHeight: "80vh",
  overflow: "auto",
};

const Profile = () => {
  const location = useLocation();
  const { userId } = useParams();
  const {
    userDispatch,
    authURL,
    cloudinaryRequest,
    setValue,
    followRequest,
    postsURL,
    refetchProfilePosts,
  } = useGlobalContext();
  const history = useNavigate();
  const [user, setUser] = useState([]);
  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showChangePhoto, setShowChangePhoto] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingFollowers, setLoadingFollowers] = useState(false);
  const cookies = new Cookies();
  const [changingProfilePhoto, setChangingProfilePhoto] = useState(false);
  const [allowFollow, setAllowFollow] = useState(true);

  const handleOpenChangePhoto = () => setShowChangePhoto(true);
  const handleCloseChangePhoto = () => setShowChangePhoto(false);

  const [showFollowersAndFollowing, setShowFollowersAndFollowing] =
    useState(false);
  const handleOpenFollowersAndFollowing = () =>
    setShowFollowersAndFollowing(true);
  const handleCloseFollowersAndFollowing = () =>
    setShowFollowersAndFollowing(false);

  const [followersAndFollowing, setFollowersAndFollowing] = useState([]);
  const [msg, setMsg] = useState("");

  const axiosGetUser = async () => {
    try {
      const response = await axios(`${authURL}/user/${userId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const {
        data: { user },
      } = response;
      setUser(user);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setChangingProfilePhoto(true);
    if (image) {
      cloudinaryRequest(image, setImageUrl);
    } else {
      setErrorMsg("Please provide an image");
    }
  };
  const changeProfilePictureRequest = async () => {
    try {
      let postImage = imageUrl.replace(".jpg", ".webp");
      postImage = postImage.replace(
        "/image/upload/",
        "/image/upload/c_scale,w_210/"
      );

      const response = await axios.patch(
        authURL,
        { profilePhoto: postImage },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.get("authToken")}`,
          },
        }
      );
      userDispatch(response.data.changeProfilePhoto);
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.changeProfilePhoto)
      );
      setUser([response.data.changeProfilePhoto]);
      setChangingProfilePhoto(false);
    } catch (error) {
      console.log(error);
      setErrorMsg("Please provide an image");
    }
  };

  useEffect(() => {
    if (imageUrl) {
      changeProfilePictureRequest();
    }
    handleCloseChangePhoto();
  }, [imageUrl]);
  const [initialFetch, setInitialFetch] = useState(true);

  const [isFetchingProfile, setIsFetchingProfile] = useState(false);
  const fetchProfilePosts = async (page = 1) => {
    const response = await axios(
      `${postsURL}/user-posts/${userId}?page=${page}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.get("authToken")}`,
        },
      }
    );
    setInitialFetch(false);

    return response.data;
  };
  const {
    data: profilePosts,
    hasNextPage,
    fetchNextPage,
    isFetching,
    refetch,
  } = useInfiniteQuery(
    "profilePosts",
    ({ pageParam = 1 }) => fetchProfilePosts(pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        const maxPages = lastPage.info.pages;
        const nextPage = allPages.length + 1;
        return nextPage <= maxPages ? nextPage : undefined;
      },
    }
  );
  useEffect(() => {
    refetch();
  }, [userId, refetchProfilePosts]);
  useEffect(() => {
    const onScroll = async (event) => {
      const { scrollHeight, scrollTop, clientHeight } =
        event.target.scrollingElement;

      if (
        !isFetchingProfile &&
        scrollHeight - scrollTop <= clientHeight * 1.5
      ) {
        setIsFetchingProfile(true);
        if (hasNextPage) await fetchNextPage();
        setIsFetchingProfile(false);
      }
    };
    document.addEventListener("scroll", onScroll);
    return () => {
      document.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    axiosGetUser();
    userDispatch(user);

    if (!user) {
      history("/login");
    }

    setShowFollowButton(
      user?.[0]?.followers?.includes(
        JSON.parse(localStorage.getItem("user"))._id
      )
    );
    setFollowersCount(user[0]?.followers?.length);
  }, [userId, location]);
  useEffect(() => {
    setValue();
  }, []);

  useEffect(() => {
    setInitialFetch(true);
  }, [userId]);
  const [showFollowButton, setShowFollowButton] = useState();
  const [followersCount, setFollowersCount] = useState(0);
  useEffect(() => {
    setShowFollowButton(
      user?.[0]?.followers?.includes(
        JSON.parse(localStorage.getItem("user"))._id
      )
    );
    setFollowersCount(user[0]?.followers?.length);
  }, [user]);

  const getUserFollowersFollowing = async (users) => {
    try {
      const response = await axios.post(
        `${authURL}/user-followers-following`,
        { users },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setFollowersAndFollowing(response?.data?.users);
      setLoadingFollowers(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="profile">
        {loading || (isFetching && initialFetch) ? (
          <Loading />
        ) : (
          <div className="profile__container">
            <div className="profile__container__header">
              <div className="profile__container__header__profile-photo">
                <Avatar
                  alt={user[0]?.username}
                  src={user[0]?.profilePhoto.replace(
                    "/image/upload/c_scale,w_210/",
                    "/image/upload/c_scale,w_450/"
                  )}
                  sx={{ width: "13rem", height: "13rem" }}
                />
                {user[0]?._id ===
                  JSON.parse(localStorage.getItem("user"))._id && (
                  <div
                    className="profile__container__header__profile-photo__overlay"
                    onClick={() => {
                      handleOpenChangePhoto();
                    }}
                  >
                    <span className="profile__container__header__profile-photo__overlay__text">
                      Change photo
                    </span>
                  </div>
                )}
              </div>
              <div className="profile__container__header__user-info">
                <div className="profile__container__header__user-info__name">
                  <Typography variant="h5" sx={{ fontSize: "2.6rem" }}>
                    @{user[0]?.username}
                  </Typography>
                </div>
                <div className="profile__container__header__user-info__stats">
                  <Typography variant="p" sx={{ marginRight: "0.8em" }}>
                    {profilePosts?.pages[0].info.count} posts
                  </Typography>
                  <Typography
                    variant="p"
                    sx={{ marginRight: "0.8em", cursor: "pointer" }}
                    onClick={() => {
                      setLoadingFollowers(true);
                      getUserFollowersFollowing(user[0]?.followers);
                      handleOpenFollowersAndFollowing();
                      setMsg("Followers");
                    }}
                  >
                    {followersCount} followers
                  </Typography>
                  <Typography
                    variant="p"
                    sx={{ marginRight: "0.8em", cursor: "pointer" }}
                    onClick={() => {
                      setLoadingFollowers(true);
                      getUserFollowersFollowing(user[0]?.following);
                      handleOpenFollowersAndFollowing();
                      setMsg("Following");
                    }}
                  >
                    {user[0]?.following?.length} following
                  </Typography>
                </div>
                <div className="profile__container__header__user-info__follow">
                  {JSON.parse(localStorage.getItem("user"))._id !==
                    user?.[0]?._id && (
                    <>
                      {showFollowButton ? (
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() => {
                            setShowFollowButton(false);
                            setAllowFollow(true);
                            setFollowersCount(followersCount - 1);
                            // pop item from user?.[0]?.followers
                            const newFollowers = user[0]?.followers.filter(
                              (follower) =>
                                follower !==
                                JSON.parse(localStorage.getItem("user"))._id
                            );
                            setUser([
                              {
                                ...user[0],
                                followers: newFollowers,
                              },
                            ]);

                            followRequest(user?.[0]?._id);
                          }}
                          sx={[
                            {
                              "&:hover": {
                                backgroundColor: "#000",
                                color: "#fff",
                              },
                              color: "#000",
                              backgroundColor: "#fff",
                              borderColor: "#000",
                              border: "2px solid #000",
                              transition: "background-color 0.2s ease",
                              height: "2em",
                            },
                          ]}
                        >
                          Unfollow
                        </Button>
                      ) : (
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() => {
                            if (allowFollow) {
                              setShowFollowButton(true);
                              setFollowersCount(followersCount + 1);
                              setUser([
                                {
                                  ...user[0],
                                  followers: [
                                    ...user?.[0]?.followers,
                                    JSON.parse(localStorage.getItem("user"))
                                      ._id,
                                  ],
                                },
                              ]);
                              setAllowFollow(false);
                              followRequest(user?.[0]?._id, "follow");
                            }
                          }}
                          sx={[
                            {
                              "&:hover": {
                                backgroundColor: "#000",
                                color: "#fff",
                              },
                              color: "#000",
                              backgroundColor: "#fff",
                              borderColor: "#000",
                              border: "2px solid #000",
                              transition: "background-color 0.2s ease",
                              height: "2em",
                            },
                          ]}
                        >
                          Follow
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="profile__container__hr"></div>
            {isFetching && initialFetch ? (
              <Loading />
            ) : profilePosts.pages[0].posts.length > 0 ? (
              <div className="profile__container__posts">
                {profilePosts.pages.map((page) =>
                  page.posts.map((post) => (
                    <Link
                      key={post?._id}
                      to={`/profile/${post?.user?._id}/${post?._id}`}
                    >
                      <img
                        src={post?.photo}
                        alt={post?.description || post?.title}
                      />
                    </Link>
                  ))
                )}
              </div>
            ) : (
              <Typography
                variant="h3"
                sx={{
                  // center
                  textAlign: "center",
                }}
              >
                No posts to display
              </Typography>
            )}
          </div>
        )}
      </div>
      <div>
        <Modal
          open={showChangePhoto}
          onClose={() => {
            handleCloseChangePhoto();
            setErrorMsg("");
          }}
          aria-labelledby="modal-modal-title"
          aria-describedbyF="modal-modal-description"
        >
          <Box sx={style}>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              {errorMsg &&
                errorMsg?.split(",").map((error, index) => (
                  <Typography
                    key={index}
                    variant="h6"
                    sx={{
                      fontWeight: "400",
                      fontSize: "1rem",
                      backgroundColor: "#f6d9d8",
                      padding: "0.5em 1em",
                      marginBottom: "1em",
                    }}
                  >
                    {error}
                  </Typography>
                ))}
              <label htmlFor="photo">Choose new profile picture:</label>
              <TextField
                margin="normal"
                required
                fullWidth
                name="photo"
                id="photo"
                type="file"
                autoComplete="off"
                // value={image}
                onChange={(e) => {
                  if (e?.target?.files[0]?.type?.includes("image")) {
                    setImage(e?.target?.files[0]);
                  } else {
                    setErrorMsg("Please provide an image");
                    e.target.value = null;
                  }
                }}
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
                  },
                ]}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={changingProfilePhoto}
                sx={[
                  {
                    "&:hover": {
                      backgroundColor: "#000",
                      color: "#fff",
                    },
                    mt: 3,
                    mb: 2,
                    color: "#000",
                    backgroundColor: "#fff",
                    borderColor: "#000",
                    border: "2px solid #000",
                    transition: "background-color 0.2s ease",
                  },
                ]}
              >
                {changingProfilePhoto
                  ? "Changing..."
                  : "Change profile picture"}
              </Button>
            </Box>
          </Box>
        </Modal>
      </div>
      <Modal
        open={showFollowersAndFollowing}
        onClose={() => {
          handleCloseFollowersAndFollowing();
        }}
        aria-labelledby="modal-modal-title"
        aria-describedbyF="modal-modal-description"
      >
        <Box sx={styleFollowersAndFollowing}>
          <div className="show-posts-likes">
            <div className="show-posts-likes__header">
              <CloseIcon
                className="show-posts-likes__header__close-icon"
                sx={[
                  {
                    "&:hover": {
                      cursor: "pointer",
                    },
                    fontSize: "2.5rem",
                  },
                ]}
                onClick={() => {
                  handleCloseFollowersAndFollowing();
                }}
              />
            </div>
            <Typography
              variant="h3"
              sx={{ fontSize: "2rem", marginBottom: "0.5em" }}
            >
              {msg}:
            </Typography>
            {loadingFollowers ? (
              <Loading />
            ) : followersAndFollowing.length > 0 ? (
              followersAndFollowing?.map((user, index) => (
                // if user._id is in followersAndFollowing, then display user
                <div className="show-posts-likes__user">
                  <div className="show-posts-likes__user__container__header">
                    {
                      <div className="show-posts-likes__user__container__header__left">
                        <div className="show-posts-likes__user__container__header__left__photo">
                          <Link
                            to={`/profile/${user?._id}`}
                            onClick={() => {
                              handleCloseFollowersAndFollowing();
                            }}
                          >
                            <Avatar
                              alt={user?.username}
                              src={user?.profilePhoto}
                              sx={{ width: "3rem", height: "3rem" }}
                            />
                          </Link>
                        </div>
                        <div className="show-posts-likes__user__container__header__left__user">
                          <Link
                            to={`/profile/${user?._id}`}
                            onClick={() => {
                              handleCloseFollowersAndFollowing();
                            }}
                          >
                            <Typography variant="h3" sx={{ fontSize: "2rem" }}>
                              @{user?.username}
                            </Typography>
                          </Link>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              ))
            ) : (
              <Typography
                variant="h3"
                sx={{
                  fontSize: "2rem",
                  textAlign: "center",
                }}
              >
                {msg === "Followers"
                  ? "User has no followers"
                  : "User is not following any accounts yet"}
              </Typography>
            )}
          </div>
        </Box>
      </Modal>
      <Outlet />
    </>
  );
};

export default Profile;
