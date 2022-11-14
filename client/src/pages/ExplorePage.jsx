import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../components/context";
import axios from "axios";
import { useState } from "react";
import { MemoShowPosts } from "../components/ShowPosts";
import { useInfiniteQuery } from "react-query";
import { Typography } from "@mui/material";
import Cookies from "universal-cookie";
import Loading from "../components/Loading";

const ExplorePage = () => {
  const { loading, likeURL, unlikeURL, setValue, postsURL } =
    useGlobalContext();
  const cookies = new Cookies();
  const [editCommentMode, setEditCommentMode] = useState(false);

  const [isFetchingExplore, setIsFetchingExplore] = useState(false);
  const fetchExplorePosts = async (page = 1) => {
    const response = await axios(`${postsURL}/explore-posts?page=${page}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.get("authToken")}`,
      },
    });
    return response.data;
  };
  const { data, hasNextPage, fetchNextPage, isFetching, isLoading } =
    useInfiniteQuery(
      "explorePosts",
      ({ pageParam = 1 }) => fetchExplorePosts(pageParam),
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
    const onScroll = async (event) => {
      const { scrollHeight, scrollTop, clientHeight } =
        event.target.scrollingElement;

      if (
        !isFetchingExplore &&
        scrollHeight - scrollTop <= clientHeight * 1.5
      ) {
        setIsFetchingExplore(true);
        if (hasNextPage) await fetchNextPage();
        setIsFetchingExplore(false);
      }
    };

    document.addEventListener("scroll", onScroll);
    return () => {
      document.removeEventListener("scroll", onScroll);
    };
  }, []);

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
    setValue(1);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="main-page">
      {loading || isLoading ? (
        <Loading />
      ) : (
        data.pages.map((page) =>
          page.posts.map((post) => (
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
              data={data}
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

export default ExplorePage;
