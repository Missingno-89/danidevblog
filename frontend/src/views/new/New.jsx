
import  { useEffect, useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./new.css";

const API_URL = process.env.REACT_APP_API_URL;

const NewBlogPost = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    category: "Sviluppo Web",
    content: ""
  });

  const [coverFile, setCoverFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [publishedId, setPublishedId] = useState(null);

  const categories = [
    "Sviluppo Web",
    "Tecnologia",
    "Intelligenza Artificiale",
    "Gaming",
    "Backend",
    "Creatività Digitale"
  ];

  // Creiamo un'anteprima locale dell'immagine
  useEffect(() => {
    if (!coverFile) {
      setPreview("");
      return;
    }

    const imageUrl = URL.createObjectURL(coverFile);
    setPreview(imageUrl);

    return () => URL.revokeObjectURL(imageUrl);
  }, [coverFile]);

  // Aggiorniamo i dati del modulo
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Selezioniamo e controlliamo l'immagine
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const acceptedTypes = [
      "image/jpeg",
      "image/png"
    ];

    if (!acceptedTypes.includes(file.type)) {
      setError("Seleziona un'immagine JPG o PNG.");
      setCoverFile(null);
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("L'immagine non può superare 5 MB.");
      setCoverFile(null);
      e.target.value = "";
      return;
    }

    setError("");
    setCoverFile(file);
  };

  // Convertiamo il testo in paragrafi HTML
  const formatContent = (text) => {
    const escaped = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

    return escaped
      .split(/\n\s*\n/)
      .map(
        (paragraph) =>
          `<p>${paragraph.replace(/\n/g, "<br>")}</p>`
      )
      .join("");
  };

  // Pubblicazione dell'articolo
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading || publishedId) return;

    setError("");

    const token = sessionStorage.getItem("token");

    if (!token) {
      setError("Devi accedere con Google per pubblicare.");
      return;
    }

    if (!form.title.trim() || !form.content.trim()) {
      setError("Titolo e contenuto sono obbligatori.");
      return;
    }

    setLoading(true);

    let createdPostId = null;

    try {
      // Calcoliamo il tempo di lettura
      const words = form.content.trim().split(/\s+/).length;
      const minutes = Math.max(1, Math.ceil(words / 200));

      // 1. Creiamo il post su MongoDB
      const response = await fetch(
        `${API_URL}/blogPosts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            title: form.title.trim(),
            category: form.category,
            cover: "",
            content: formatContent(form.content),
            readTime: {
              value: minutes,
              unit: "min"
            }
          })
        }
      );

      const post = await response.json();

      if (!response.ok) {
        throw new Error(
          post.message || "Errore nella creazione del post"
        );
      }

      createdPostId = post._id;

      // 2. Carichiamo la copertina su Cloudinary
      if (coverFile) {
        const formData = new FormData();
        formData.append("cover", coverFile);

        const uploadResponse = await fetch(
          `${API_URL}/blogPosts/${post._id}/cover`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`
            },
            body: formData
          }
        );

        if (!uploadResponse.ok) {
          const uploadError = await uploadResponse
            .json()
            .catch(() => ({}));

          throw new Error(
            uploadError.message ||
            "Errore nel caricamento della copertina"
          );
        }
      }

      // 3. Apriamo l'articolo pubblicato
      navigate(`/blog/${post._id}`);

    } catch (err) {
      if (createdPostId) {
        setPublishedId(createdPostId);

        setError(
          "L'articolo è stato creato, ma la copertina " +
          "non è stata caricata. Non ripubblicarlo."
        );
      } else {
        setError(err.message);
      }

      console.error("Errore pubblicazione:", err);

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="editor-page">
      <Container className="editor-container">

        {/* Intestazione editor */}
        <div className="editor-heading">
          <span className="editor-eyebrow">
            DANI DEV BLOG / EDITOR
          </span>

          <h1>Racconta una nuova storia.</h1>

          <p>
            Scrivi, aggiungi una copertina
            e condividi le tue idee.
          </p>
        </div>

        <Form
          onSubmit={handleSubmit}
          className="editor-form"
        >

          {/* Categoria */}
          <Form.Group className="mb-4">
            <Form.Label>Categoria</Form.Label>

            <Form.Select
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Titolo */}
          <Form.Group className="mb-4">
            <Form.Label>Titolo dell'articolo</Form.Label>

            <Form.Control
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="Scrivi il titolo..."
              maxLength={150}
              required
            />
          </Form.Group>

          {/* Copertina */}
          <Form.Group className="mb-4">
            <Form.Label>
              Copertina dell'articolo
            </Form.Label>

            <div className="editor-upload-area">
              <Form.Control
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleImageChange}
              />

              <p>
                Scegli un'immagine JPG o PNG.
                Dimensione massima: 5 MB.
              </p>
            </div>

            {preview && (
              <div className="editor-image-preview">
                <img
                  src={preview}
                  alt="Anteprima copertina"
                />
                <span>Anteprima copertina</span>
              </div>
            )}
          </Form.Group>

          {/* Contenuto */}
          <Form.Group className="mb-4">
            <Form.Label>
              Contenuto dell'articolo
            </Form.Label>

            <Form.Control
              as="textarea"
              name="content"
              rows={12}
              value={form.content}
              onChange={handleChange}
              placeholder="Inizia a scrivere..."
              required
            />
          </Form.Group>

          {/* Messaggi di errore */}
          {error && (
            <p className="editor-error" role="alert">
              {error}
            </p>
          )}

          {/* Articolo già creato */}
          {publishedId && (
            <p>
              <Link to={`/blog/${publishedId}`}>
                Apri l'articolo già creato
              </Link>
            </p>
          )}

          {/* Pulsanti */}
          <div className="editor-actions">
            <Button
              type="button"
              variant="outline-dark"
              onClick={() => navigate("/")}
            >
              Annulla
            </Button>

            <Button
              type="submit"
              className="editor-publish-btn"
              disabled={loading || Boolean(publishedId)}
            >
              {loading
                ? "Pubblicazione in corso..."
                : "Pubblica articolo →"}
            </Button>
          </div>

        </Form>
      </Container>
    </main>
  );
};

export default NewBlogPost;
