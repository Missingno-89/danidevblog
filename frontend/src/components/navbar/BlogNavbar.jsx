
import React, { useEffect, useState } from "react";
import { Button, Container, Navbar } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./blognavbar.css";

const NavBar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;

    const getUser = async () => {
      const token = sessionStorage.getItem("token");

      if (!token) {
        if (!cancelled) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error("Token non valido");
        }

        const data = await response.json();

        if (!cancelled) {
          setUser(data);
        }

      } catch (error) {
        console.error(error.message);

        if (!cancelled) {
          setUser(null);

          // Eliminiamo il token solo se non è cambiato
          if (sessionStorage.getItem("token") === token) {
            sessionStorage.removeItem("token");
          }
        }

      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    getUser();

    return () => {
      cancelled = true;
    };
  }, [location.pathname]);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <Navbar className="magazine-navbar" fixed="top">
      <Container className="magazine-navbar-container">

        {/* Logo */}
        <Navbar.Brand
          as={Link}
          to="/"
          className="magazine-logo"
        >
          DANI<span>DEV.</span>
        </Navbar.Brand>

        {/* Navigazione */}
        <div className="magazine-nav-links">
          <Link to="/">Home</Link>
          <Link to="/#articoli">Articoli</Link>
        </div>

        {/* Area utente */}
        <div className="magazine-user">

          {user && (
            <Button
              as={Link}
              to="/new"
              className="magazine-write-btn"
            >
              + Scrivi
            </Button>
          )}

          {!loading && (
            user ? (
              <>
                {user.avatar && (
                  <img
                    src={user.avatar}
                    alt="Profilo"
                    className="magazine-avatar"
                    referrerPolicy="no-referrer"
                  />
                )}

                <span className="magazine-username">
                  {user.name}
                </span>

                <button
                  type="button"
                  className="magazine-logout"
                  onClick={handleLogout}
                >
                  Esci
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="magazine-login"
              >
                Accedi
              </Link>
            )
          )}

        </div>
      </Container>
    </Navbar>
  );
};

export default NavBar;
