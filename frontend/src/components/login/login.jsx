
import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      sessionStorage.setItem("token", token);
      navigate("/", { replace: true });
    }
  }, [searchParams, navigate]);

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
  };

  return (
    <Container className="login-page">
      <div className="login-card">
        <div className="login-icon">DD.</div>

        <h1>Benvenuto su Dani Dev Blog</h1>

        <p className="login-description">
          Il luogo dove il codice incontra idee, creatività e cultura digitale.
          Accedi per leggere, scrivere e condividere le tue storie.
        </p>

        <button
          type="button"
          className="google-login-btn"
          onClick={handleGoogleLogin}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fill="#4285F4"
              d="M21.35 12.21c0-.7-.06-1.39-.18-2.06H12v3.9h5.24a4.48 4.48 0 0 1-1.94 2.94v2.44h3.14c1.84-1.69 2.91-4.18 2.91-7.22Z"
            />
            <path
              fill="#34A853"
              d="M12 21.73c2.62 0 4.82-.87 6.43-2.35l-3.14-2.44c-.87.58-1.98.92-3.29.92-2.53 0-4.67-1.71-5.43-4.01H3.34v2.52A9.72 9.72 0 0 0 12 21.73Z"
            />
            <path
              fill="#FBBC05"
              d="M6.57 13.85a5.83 5.83 0 0 1 0-3.7V7.63H3.34a9.73 9.73 0 0 0 0 8.74l3.23-2.52Z"
            />
            <path
              fill="#EA4335"
              d="M12 6.14c1.42 0 2.68.49 3.68 1.45l2.76-2.77A9.31 9.31 0 0 0 12 2.27a9.72 9.72 0 0 0-8.66 5.36l3.23 2.52c.76-2.3 2.9-4.01 5.43-4.01Z"
            />
          </svg>

          Continua con Google
        </button>

        <p className="login-footer">
          Accedi in modo semplice e sicuro utilizzando il tuo account Google.
        </p>
      </div>
    </Container>
  );
};

export default Login;
