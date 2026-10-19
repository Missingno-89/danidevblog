
import React from "react";
import { Container } from "react-bootstrap";
import BlogList from "../../components/blog/blog-list/BlogList";
import "./home.css";

const Home = () => {
  return (
    <main className="magazine-home">
      <Container>

        {/* Intestazione editoriale */}
        <section className="magazine-hero">
          <span className="magazine-eyebrow">
            TECHNOLOGY / CODE / CULTURE
          </span>

          <h1>
            Idee, codice e
            <br />
            <em>visioni digitali.</em>
          </h1>

          <p>
            Benvenuto su Dani Dev Blog.
            Uno spazio dedicato alla tecnologia,
            allo sviluppo web, al gaming e
            alla cultura digitale.
          </p>
        </section>

        {/* Sezione articoli */}
        <section
          id="articoli"
          className="magazine-articles"
        >
          <div className="magazine-section-heading">
            <div>
              <span className="magazine-eyebrow">
                THE LATEST
              </span>
              <h2>Ultime storie</h2>
            </div>

            <span className="magazine-section-label">
              ESPLORA IL BLOG
            </span>
          </div>

          <BlogList />
        </section>

      </Container>
    </main>
  );
};

export default Home;
