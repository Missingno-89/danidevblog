
import React, { useEffect, useState } from "react";
import BlogItem from "../blog-item/BlogItem";
import "./bloglist.css";

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          "http://localhost:9097/blogPosts"
        );

        if (!response.ok) {
          throw new Error("Errore nel caricamento dei post");
        }

        const data = await response.json();
        setPosts(Array.isArray(data) ? data : []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <p>Caricamento articoli...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  if (posts.length === 0) {
    return <p>Non ci sono ancora articoli.</p>;
  }

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <div className="magazine-posts">

      <div className="magazine-featured">
        <BlogItem {...featuredPost} featured />
      </div>

      {otherPosts.length > 0 && (
        <>
          <div className="magazine-grid-heading">
            <h3>Da non perdere</h3>
          </div>

          <div className="magazine-post-grid">
            {otherPosts.map((post) => (
              <BlogItem
                key={post._id}
                {...post}
              />
            ))}
          </div>
        </>
      )}

    </div>
  );
};

export default BlogList;
