import { useEffect, useState } from "react";
import "../styles/Blogpage.css";
import { useNavigate } from "react-router-dom";

function Savedblogs() {
  const navigate = useNavigate();
  const [savedBlogs, setSavedBlogs] = useState([]);
  const [expandedTitles, setExpandedTitles] = useState({});

  useEffect(() => {
    const fetchSavedBlogs = async () => {
      try {
        const username = localStorage.getItem("Username");
        if (!username) {
          throw new Error("Username not found in localStorage");
        }

        const res = await fetch("/api/savedblogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const jsondata = await res.json();
        setSavedBlogs(jsondata.savedBlogs);
        console.log(jsondata.savedBlogs);
      } catch (error) {
        console.error("Error fetching saved blogs:", error);
        // Handle error state if needed
      }
    };

    fetchSavedBlogs();
  }, []);

  if (savedBlogs.length === 0) {
    return <div>Loading...</div>;
  }

  const handleBlogClick = (blogId) => {
    console.log(`Navigating to saved blog with ID: ${blogId}`);
    navigate(`/blog/${blogId}`);
  };

  const extractFirstImageAndSnippet = (content) => {
    const doc = new DOMParser().parseFromString(content, "text/html");
    const img = doc.querySelector("img");
    const text = doc.body.textContent || "";
    return {
      image: img ? img.src : null,
      snippet: text.slice(0, 200) + "...",
    };
  };

  const toggleTitleExpansion = (index) => {
    setExpandedTitles((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const userPhoto = localStorage.getItem("Photo");

  return (
    <div className="blog-page">
      {savedBlogs.map((data, index) => {
        const contentPreview = extractFirstImageAndSnippet(data.content);
        const isExpanded = expandedTitles[index];
        const title = data.title;
        const snippet = contentPreview.snippet;

        return (
          <div key={index} className="blog-post">
            {contentPreview.image ? (
              <img src={contentPreview.image} alt="Blog Image" />
            ) : (
              <img src={userPhoto} alt="User Photo" />
            )}
            <h2 className="blogtitle">
              {title &&
                (isExpanded || title.length <= 70 ? (
                  title
                ) : (
                  <>
                    {title.slice(0, 70)}...{" "}
                    <span
                      className="blog-page-show-more"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTitleExpansion(index);
                      }}
                    >
                      Read More
                    </span>
                  </>
                ))}
            </h2>
            <span className="blogpagesnippet">{snippet}</span>
            <div className="blogseemore">
              <button onClick={() => handleBlogClick(data._id)}>
                Read More
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Savedblogs;
