import { useEffect, useMemo, useRef } from "react";
import { useGlobalContext } from "../components/context";
import axios from "axios";
import { useState } from "react";
import { MemoShowPosts } from "../components/ShowPosts";
import { Typography } from "@mui/material";
import Cookies from "universal-cookie";
import Loading from "../components/Loading";
import { useInfiniteQuery } from "react-query";

const Home = () => {
  const { loading, likeURL, unlikeURL, setValue, postsURL, createPost } =
    useGlobalContext();
  const cookies = new Cookies();
  const [editCommentMode, setEditCommentMode] = useState(false);

  const [isFetchingHome, setIsFetchingHome] = useState(false);
  const fetchHomePosts = async (page = 1) => {
    const response = await axios(`${postsURL}/home-posts?page=${page}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.get("authToken")}`,
      },
    });
    return response.data;
  };

  const { data, hasNextPage, fetchNextPage, isFetching, isLoading, refetch } =
    useInfiniteQuery(
      "homePosts",
      ({ pageParam = 1 }) => fetchHomePosts(pageParam),
      {
        getNextPageParam: (lastPage, allPages) => {
          const maxPages = lastPage.info.pages;
          const nextPage = allPages.length + 1;
          return nextPage <= maxPages ? nextPage : undefined;
        },
        refetchOnWindowFocus: false,
      }
    );
  useEffect(() => {
    console.log({ data });
  }, [data]);

  const [followRerender, setFollowRerender] = useState({});

  const executeScroll = (element) => {
    element.scrollIntoView();
  };

  useEffect(() => {
    const onScroll = async (event) => {
      const { scrollHeight, scrollTop, clientHeight } =
        event.target.scrollingElement;

      if (!isFetchingHome && scrollHeight - scrollTop <= clientHeight * 1.5) {
        if (Object.keys(followRerender).length !== 0) {
          refetch();
          const elementId = data.pages[data.pages.length - 2].posts[0]._id;
          executeScroll(document.getElementById(elementId));
          setFollowRerender({});
        } else {
          setIsFetchingHome(true);
          if (hasNextPage) await fetchNextPage();
          setIsFetchingHome(false);
        }
      }
    };
    document.addEventListener("scroll", onScroll);
    return () => {
      document.removeEventListener("scroll", onScroll);
    };
  }, [followRerender, data]);

  useEffect(() => {
    console.log({ data });
  }, [data]);

  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    editComment: "",
    editCommentId: "",
    editCommentPostId: "",
  });
  const handleChange = useMemo(
    () => (e) => {
      setInputs({
        ...inputs,
        [e.target.name]: e.target.value,
      });
    },
    [inputs]
  );

  const likeRequest = async (postId) => {
    try {
      const response = await axios.put(
        likeURL,
        { postId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.get("authToken")}`,
          },
        }
      );
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
            Authorization: `Bearer ${cookies.get("authToken")}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setValue();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [initalRender, setInitalRender] = useState(true);
  const [postDeleted, setPostDeleted] = useState(false);

  useEffect(() => {
    if (!initalRender) {
      refetch();
    }
    setInitalRender(false);
  }, [postDeleted, createPost]);

  return (
    <div className="main-page">
      {loading || isLoading ? (
        <Loading />
      ) : (
        data.pages.map((page) =>
          page.posts.map((post, index, row) => (
            <MemoShowPosts
              key={post?._id}
              mapPost={post}
              unlikeRequest={unlikeRequest}
              likeRequest={likeRequest}
              editCommentMode={editCommentMode}
              inputs={inputs}
              setInputs={setInputs}
              setEditCommentMode={setEditCommentMode}
              handleChange={handleChange}
              followRerender={followRerender}
              setFollowRerender={setFollowRerender}
              setPostDeleted={setPostDeleted}
              executeScroll={executeScroll}
              index={index}
              row={row}
            />
          ))
        )
      )}
      {isFetching && !isLoading && <Loading />}

      {!loading && !isFetching && (
        <Typography
          variant="h6"
          noWrap
          component="a"
          sx={{
            mr: 2,
            display: "flex",
            fontFamily: "monospace",
            fontWeight: 700,
            color: "inherit",
            textDecoration: "none",
            margin: "1em auto",
            padding: "0 1em",
            justifyContent: "center",
            // enable text wrap
            whiteSpace: "normal",
            wordWrap: "break-word",
          }}
        >
          To find more posts navigate to the explore page or search for a
          specific user using the navbar
        </Typography>
      )}
    </div>
  );
};

export default Home;
