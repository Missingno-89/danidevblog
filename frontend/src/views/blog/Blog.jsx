import { useEffect, useState } from "react";
import { Container, Image } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import BlogAuthor from "../../components/blog/blog-author/BlogAuthor";
import BlogLike from "../../components/likes/BlogLike";
import "./blog.css";

const Blog = props => {
  const [blog, setBlog] = useState({});
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const { id } = params;
  const navigate = useNavigate();

  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Sei sicuro di voler eliminare questo articolo?"
    );

    if (!confirmed) return;

    const token = sessionStorage.getItem("token");

    if (!token) {
      alert("Devi effettuare il login.");
      return;
    }

    try {
      setDeleting(true);

      const response = await fetch(
        `http://localhost:9097/blogPosts/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.message || "Errore durante l'eliminazione"
        );
      }

      alert("Articolo eliminato correttamente!");
      navigate("/");

    } catch (error) {
      alert(error.message);
    } finally {
      setDeleting(false);
    }
  };

  const fetchPost = async () => {
    try {
      const result = await fetch(`http://localhost:9097/blogPosts/${id}`)
      const data = await result.json()
      console.log("POST COMPLETO:", data);
      console.log("AUTORE:", data.author);

      if (data) {
        setBlog(data);
        setLoading(false);

      } else {
        navigate("/404");
      }


    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    fetchPost()

  }, []);

  if (loading) {
    return <div>loading</div>;
  } else {
    return (
      <div className="blog-details-root">
        <Container>
          <Image className="blog-details-cover" src={blog.cover} fluid />
          <h1 className="blog-details-title">{blog.title}</h1>

          <button
            type="button"
            className="delete-post-btn"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Eliminazione..." : "Elimina articolo"}
          </button>


          <div className="blog-details-container">
            <div className="blog-details-author">
              <BlogAuthor author={blog.author} />
            </div>
            <div className="blog-details-info">
              <div>{blog.createdAt}</div>
              <div>{`lettura da ${blog.readTime.value} ${blog.readTime.unit}`}</div>
              <div
                style={{
                  marginTop: 20,
                }}
              >
                <BlogLike defaultLikes={["123"]} onChange={console.log} />
              </div>
            </div>
          </div>

          <div
            dangerouslySetInnerHTML={{
              __html: blog.content,
            }}
          ></div>
        </Container>
      </div>
    );
  }
};

export default Blog;
