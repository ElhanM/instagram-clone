import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../components/context";
import axios from "axios";
import { useState } from "react";
import Posts from "../components/ShowPosts";

const ExplorePage = () => {
  const {
    userDispatch,
    userInfo,
    allPosts,
    loading,
    updatePostsDispatch,
    likeURL,
    unlikeURL,
    commentURL,
    handleSubmit,
    deleteComment,
    editComment,
    followRequest,
  } = useGlobalContext();
  const [explorePosts, setExplorePosts] = useState([]);
  const [addComment, setAddComment] = useState("");
  const [editCommentMode, setEditCommentMode] = useState(false);
  const [initialRender, setInitialRender] = useState(true);

  const [inputs, setInputs] = useState({
    editComment: "",
    editCommentId: "",
    editCommentPostId: "",
  });
  const handleChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };
  const history = useNavigate();

  const likeRequest = async (postId) => {
    try {
      const response = await axios.put(
        likeURL,
        { postId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      const updatedPosts = allPosts?.map((post) => {
        if (post?._id === response?.data?.likePost?._id) {
          return { ...post, likes: response?.data?.likePost?.likes };
        } else {
          return post;
        }
      });
      updatePostsDispatch(updatedPosts);
    } catch (error) {
      console.log(error);
    }
  };
  const unlikeRequest = async (postId) => {
    try {
      const response = await axios.put(
        unlikeURL,
        { postId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      const updatedPosts = allPosts?.map((post) => {
        if (post._id === response?.data?.unlikePost?._id) {
          return { ...post, likes: response?.data?.unlikePost?.likes };
        } else {
          return post;
        }
      });
      updatePostsDispatch(updatedPosts);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    userDispatch(user);
    if (!user) {
      history("/login");
    }
    if (initialRender) {
      setExplorePosts(
        allPosts?.filter((post) => {
          return (
            // return post if post?.user?._id !== user?._id and if initial render is true make !post?.user?.followers?.includes(JSON.parse(localStorage.getItem("user"))._id) second condition
            post?.user?._id !== JSON.parse(localStorage.getItem("user"))._id &&
            (!initialRender ||
              !post?.user?.followers?.includes(
                JSON.parse(localStorage.getItem("user"))._id
              ))
          );
        })
      );
    } else {
      // fixing bug where posts from people the user was following showed up in explore page
      const tempAllPosts = allPosts?.filter((post) => {
        return (
          post?.user?._id !== JSON.parse(localStorage.getItem("user"))._id &&
          (!initialRender ||
            !post?.user?.followers?.includes(
              JSON.parse(localStorage.getItem("user"))._id
            ))
        );
      });
      // if explorePosts does not contain post from tempHomePosts then remove it
      const tempExplorePosts = tempAllPosts?.filter((post) => {
        return explorePosts.find(
          (explorePost) => post?._id === explorePost?._id
        );
      });
      setExplorePosts(tempExplorePosts);
    }
  }, [allPosts]);
  useEffect(() => {
    console.log("initialrender", initialRender);
    if (explorePosts.length > 0) {
      setInitialRender(false);
    }
  }, [explorePosts, initialRender]);
  return (
    <div className="main-page">
      {loading ? (
        <h1>Loading...</h1>
      ) : allPosts === [] ? (
        <h1>No posts to display </h1>
      ) : (
        explorePosts
          ?.slice(0)
          .reverse()
          .map((post, index) => (
            <Posts
              post={post}
              unlikeRequest={unlikeRequest}
              likeRequest={likeRequest}
              editCommentMode={editCommentMode}
              inputs={inputs}
              setInputs={setInputs}
              setEditCommentMode={setEditCommentMode}
              handleChange={handleChange}
            />
          ))
      )}
    </div>
  );
};

export default ExplorePage;
