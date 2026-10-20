
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./blogcomments.css";

const API_URL = process.env.REACT_APP_API_URL;

const BlogComments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");

  const token = sessionStorage.getItem("token");

  // Recupera i commenti dell'articolo
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/blogPosts/${postId}/comments`
        );

        if (!response.ok) {
          throw new Error("Errore nel caricamento dei commenti");
        }

        const data = await response.json();
        setComments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchComments();
    }
  }, [postId]);

  // Pubblica un nuovo commento
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim() || publishing) return;

    if (!token) {
      setError("Devi effettuare il login.");
      return;
    }

    try {
      setPublishing(true);
      setError("");

      const response = await fetch(
        `${API_URL}/blogPosts/${postId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            text: text.trim()
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Errore nella pubblicazione"
        );
      }

      setComments((prev) => [...prev, data]);
      setText("");
    } catch (err) {
      setError(err.message);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <section className="blog-comments">
      <h2>Commenti ({comments.length})</h2>

      {loading ? (
        <p>Caricamento commenti...</p>
      ) : comments.length === 0 ? (
        <p>Non ci sono ancora commenti.</p>
      ) : (
        comments.map((comment) => (
          <div
            key={comment._id}
            className="blog-comment"
          >
            <strong>{comment.author}</strong>
            <p>{comment.text}</p>
          </div>
        ))
      )}

      {error && (
        <p role="alert" style={{ color: "crimson" }}>
          {error}
        </p>
      )}

      {token ? (
        <form onSubmit={handleSubmit}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Scrivi un commento..."
            rows={4}
            maxLength={1000}
            required
          />

          <button
            type="submit"
            disabled={publishing || !text.trim()}
          >
            {publishing
              ? "Pubblicazione..."
              : "Pubblica commento"}
          </button>
        </form>
      ) : (
        <p>
          <Link to="/login">Accedi</Link> per lasciare un commento.
        </p>
      )}
    </section>
  );
};

export default BlogComments;
