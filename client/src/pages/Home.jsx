import { useEffect, useMemo } from "react";
import { useGlobalContext } from "../components/context";
import axios from "axios";
import { useState } from "react";
import { MemoShowPosts } from "../components/ShowPosts";
import { Typography } from "@mui/material";
import Cookies from "universal-cookie";
import Loading from "../components/Loading";
import { useInfiniteQuery } from "react-query";
import { useLocation } from "react-router-dom";

const Home = () => {
  const {
    likeURL,
    unlikeURL,
    setValue,
    postsURL,
    createPost,
    setCreatePost,
    dataStateHome,
    setDataStateHome,
    followRerender,
    setFollowRerender,
    homeRerender,
    setHomeRerender,
    postDeleted,
    setPostDeleted,
    loading,
    setLoading,
  } = useGlobalContext();
  const cookies = new Cookies();
  const [editCommentMode, setEditCommentMode] = useState(false);

  const location = useLocation();

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
    if (postDeleted) {
      setDataStateHome([]);
      setLoading(true);
    }
  }, [location.pathname]);
  useEffect(() => {
    if (postDeleted || createPost) {
      setDataStateHome([]);
      refetch();
      setPostDeleted(false);
      setCreatePost(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [initialRefetch, setInitialRefetch] = useState(
    Object.keys(followRerender).length !== 0
  );

  const initalRenderPosts = async () => {
    setDataStateHome([]);
    for (const key in data) {
      delete data[key];
    }
    await refetch();
    setInitialRefetch(false);
    setFollowRerender({});
    setHomeRerender(false);
  };

  useEffect(() => {
    if (initialRefetch || homeRerender)
      if (Object.keys(data).length !== 0) initalRenderPosts();
  }, []);

  const [textRender, setTextRender] = useState(false);
  useEffect(() => {
    setTextRender(false);
    if (Object.keys(data).length !== 0 && !isFetching && !isLoading) {
      const newData = data?.pages?.map((page) => page.posts).flat();
      const oldData = dataStateHome;
      const uniqueData = newData?.filter(
        (newItem) => !oldData.some((oldItem) => oldItem._id === newItem._id)
      );
      setDataStateHome([...oldData, ...uniqueData]);
    }
    setTextRender(true);
  }, [data, isFetching]);

  useEffect(() => {
    const onScroll = async (event) => {
      const { scrollHeight, scrollTop, clientHeight } =
        event.target.scrollingElement;

      if (!isFetchingHome && scrollHeight - scrollTop <= clientHeight * 1.5) {
        setIsFetchingHome(true);
        if (hasNextPage) await fetchNextPage();
        setIsFetchingHome(false);
      }
    };
    document.addEventListener("scroll", onScroll);
    return () => {
      document.removeEventListener("scroll", onScroll);
    };
  }, [followRerender, data]);

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

  return (
    <div className="main-page">
      {loading || isLoading || initialRefetch ? (
        <Loading />
      ) : (
        dataStateHome.map((post) => (
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
            setPostDeleted={setPostDeleted}
            initialRefetch={initialRefetch}
            refetch={refetch}
          />
        ))
      )}
      {isFetching && !isLoading && !initialRefetch && <Loading />}

      {!isFetching && textRender && (
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
