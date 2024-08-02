import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import "../styles/Blogpage.css";
import parser from "react-html-parser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faThumbsDown,
  faComment,
  faBookmark,
  faShareSquare,
} from "@fortawesome/free-solid-svg-icons";
import Commentpage from "./Commentpage";
import "../styles/Blogdetail.css";
import Sharebutton from "./Sharebutton";

function BlogDetail() {
  const { blogId } = useParams();
  const [showComment, setShowComment] = useState(true);
  const [focus, setFocus] = useState(true);
  const [blogData, setBlogData] = useState(null);
  const [showshareblog, setshowshareblog] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const currentUser = localStorage.getItem("Username");

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const res = await fetch(`/api/blogs/${blogId}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const jsonData = await res.json();
        setBlogData(jsonData.blog);

        // Check if the blog is saved by the current user
        const userRes = await fetch(`/api/users/${currentUser}`);
        const userData = await userRes.json();
        if (userData.savedBlogs.includes(blogId)) {
          setIsSaved(true);
        }
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    fetchBlogData();
  }, [blogId, currentUser]);

  const handleLike = async () => {
    try {
      const res = await fetch("/api/blog/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogId, username: currentUser }),
      });

      if (!res.ok) {
        throw new Error("Failed to like the blog");
      }

      const updatedBlog = await res.json();
      setBlogData(updatedBlog);
    } catch (error) {
      console.error("There was a problem with the like operation:", error);
    }
  };

  const handleDislike = async () => {
    try {
      const res = await fetch("/api/blog/dislike", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogId, username: currentUser }),
      });

      if (!res.ok) {
        throw new Error("Failed to dislike the blog");
      }

      const updatedBlog = await res.json();
      setBlogData(updatedBlog);
    } catch (error) {
      console.error("There was a problem with the dislike operation:", error);
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch(
        `/api/blog/${isSaved ? "unsaveblog" : "saveblog"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ blogId, username: currentUser }), // Ensure currentUser is correctly defined
        }
      );

      if (!res.ok) {
        throw new Error(
          `Failed to ${isSaved ? "unsave" : "save"} the blog. Server returned ${
            res.status
          }`
        );
      }

      // Update the state to reflect the change in saved status
      setIsSaved(!isSaved);
    } catch (error) {
      console.error(
        `There was a problem with the ${
          isSaved ? "unsave" : "save"
        } operation:`,
        error
      );
    }
  };

  if (!blogData) {
    return <div>Loading...</div>;
  }

  const date = new Date(blogData.createdAt).toLocaleDateString();
  const userHasLiked = blogData.likedBy.includes(currentUser);
  const userHasDisliked = blogData.dislikedBy.includes(currentUser);
  const blogurl = window.location.href;

  return (
    <div className="blog-detail-page">
      <div className="blog-detail-post">
        <h2 className="blogdetailtitle">{blogData.title}</h2>
        <div className="blogdetailuser">
          <div>
            <div className="blogdetailuserimgdiv">
              <img src={blogData.userphoto} alt={`image-${blogId}`} />
            </div>
            <div className="blogdetailusercontentdiv">
              <div>
                <p>{blogData.username}</p>
                <NavLink style={{ textDecoration: "none" }}>Follow</NavLink>
              </div>
              <p>
                <b>Published on: </b>
                {date}
              </p>
            </div>
          </div>
        </div>
        <hr className="hrtagofblogdetail" />
        <div className="blogdetailactivity">{parser(blogData.content)}</div>
        <div className="blogdetaillikecomment">
          <div
            onClick={handleLike}
            style={{ color: userHasLiked ? "blue" : "grey" }}
          >
            <FontAwesomeIcon icon={faThumbsUp} />
            <span>{blogData.likes}</span>
          </div>
          <div
            onClick={handleDislike}
            style={{ color: userHasDisliked ? "blue" : "grey" }}
          >
            <FontAwesomeIcon icon={faThumbsDown} />
            <span>{blogData.dislikes}</span>
          </div>
          <div
            onClick={() => {
              setShowComment(!showComment);
              setFocus(!focus);
            }}
          >
            <FontAwesomeIcon icon={faComment} />
            <span>{blogData.comments.length}</span>
          </div>
          <div onClick={handleSave}>
            <FontAwesomeIcon
              icon={faBookmark}
              style={{ color: isSaved ? "blue" : "black" }}
            />
          </div>
          <div style={{ position: "relative" }}>
            <FontAwesomeIcon
              icon={faShareSquare}
              onClick={() => {
                setshowshareblog(!showshareblog);
              }}
            />
            {showshareblog ? <Sharebutton blogurl={blogurl} /> : ""}
          </div>
        </div>
      </div>
      <hr className="hrtagofblogdetail" />
      <div className="blog-detail-hide-div">
        <button
          onClick={() => {
            setShowComment(!showComment);
            setFocus(!focus);
          }}
        >
          {showComment ? "Hide Comments" : "Show Comments"}
        </button>
      </div>

      {showComment ? <Commentpage onFocus={focus} blogId={blogId} /> : ""}
    </div>
  );
}

export default BlogDetail;
