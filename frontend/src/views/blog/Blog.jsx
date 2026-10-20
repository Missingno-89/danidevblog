
import { useEffect, useState } from "react";
import { Container, Image } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import BlogAuthor from "../../components/blog/blog-author/BlogAuthor";
import BlogLike from "../../components/likes/BlogLike";
import BlogComments from "../../components/blog/blog-comments/BlogComments";
import "./blog.css";

const Blog = () => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL;

  // Recuperiamo l'articolo dal backend
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/blogPosts/${id}`
        );

        if (!response.ok) {
          throw new Error("Articolo non trovato");
        }

        const data = await response.json();

        setBlog(data);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, API_URL]);

  // Eliminiamo l'articolo
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
        `${API_URL}/blogPosts/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));

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

  // Caricamento
  if (loading) {
    return (
      <Container className="blog-details-root">
        <p>Caricamento articolo...</p>
      </Container>
    );
  }

  // Gestione errori
  if (error || !blog) {
    return (
      <Container className="blog-details-root">
        <h2>Impossibile caricare l'articolo</h2>
        <p>{error || "Articolo non disponibile"}</p>
        <button onClick={() => navigate("/")}>
          Torna alla homepage
        </button>
      </Container>
    );
  }

  return (
    <div className="blog-details-root">
      <Container>

        {/* Immagine di copertina */}
        {blog.cover && (
          <Image
            className="blog-details-cover"
            src={blog.cover}
            alt={blog.title}
            fluid
          />
        )}

        {/* Titolo */}
        <h1 className="blog-details-title">
          {blog.title}
        </h1>

        {/* Eliminazione articolo */}
        <button
          type="button"
          className="delete-post-btn"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting
            ? "Eliminazione..."
            : "Elimina articolo"}
        </button>

        {/* Informazioni articolo */}
        <div className="blog-details-container">

          <div className="blog-details-author">
            <BlogAuthor author={blog.author} />
          </div>

          <div className="blog-details-info">

            {blog.createdAt && (
              <div>
                {new Date(blog.createdAt).toLocaleDateString(
                  "it-IT",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  }
                )}
              </div>
            )}

            {blog.readTime && (
              <div>
                {`Lettura: ${blog.readTime.value} ${blog.readTime.unit || "min"
                  }`}
              </div>
            )}

            <div style={{ marginTop: 20 }}>
              <BlogLike
                defaultLikes={["123"]}
                onChange={console.log}
              />
            </div>

          </div>
        </div>

        {/* Contenuto articolo */}
        <div
          className="blog-article-content"
          dangerouslySetInnerHTML={{
            __html: blog.content || ""
          }}
        />
        <BlogComments postId={id} />

      </Container>
    </div>
  );
};

export default Blog;
