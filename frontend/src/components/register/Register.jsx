
import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "../login/login.css";

const API_URL = process.env.REACT_APP_API_URL;

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 8) {
      setError("La password deve contenere almeno 8 caratteri.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: form.name.trim(),
          surname: form.surname.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Errore durante la registrazione"
        );
      }

      // Registrazione completata: andiamo al login
      navigate("/login", {
        replace: true
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="login-page">
      <div className="login-card">

        <div className="login-icon">DD.</div>

        <h1>Crea il tuo account</h1>

        <p className="login-description">
          Entra nella community di Dani Dev Blog.
          Registrati per pubblicare articoli e commentare.
        </p>

        <form
          className="classic-login-form"
          onSubmit={handleSubmit}
        >
          <label htmlFor="register-name">Nome</label>
          <input
            id="register-name"
            type="text"
            name="name"
            placeholder="Il tuo nome"
            value={form.name}
            onChange={handleChange}
            autoComplete="given-name"
            required
          />

          <label htmlFor="register-surname">Cognome</label>
          <input
            id="register-surname"
            type="text"
            name="surname"
            placeholder="Il tuo cognome"
            value={form.surname}
            onChange={handleChange}
            autoComplete="family-name"
            required
          />

          <label htmlFor="register-email">Email</label>
          <input
            id="register-email"
            type="email"
            name="email"
            placeholder="La tua email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />

          <label htmlFor="register-password">Password</label>
          <input
            id="register-password"
            type="password"
            name="password"
            placeholder="Almeno 8 caratteri"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
            minLength={8}
            required
          />

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="classic-login-btn"
            disabled={loading}
          >
            {loading
              ? "Registrazione in corso..."
              : "Registrati"}
          </button>
        </form>

        <p className="login-register-link">
          Hai già un account?{" "}
          <Link to="/login">Accedi</Link>
        </p>

      </div>
    </Container>
  );
};

export default Register;
