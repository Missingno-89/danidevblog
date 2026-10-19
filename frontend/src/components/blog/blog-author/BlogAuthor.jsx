
import React from "react";
import "./blogauthor.css";

const BlogAuthor = ({ author, avatar }) => {
  const authorName = author || "Autore sconosciuto";

  return (
    <div className="magazine-author">

      {avatar ? (
        <img
          src={avatar}
          alt={authorName}
          className="magazine-author-avatar"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="magazine-author-placeholder">
          {authorName.charAt(0).toUpperCase()}
        </div>
      )}

      <div className="magazine-author-info">
        <span>Scritto da</span>
        <strong>{authorName}</strong>
      </div>

    </div>
  );
};

export default BlogAuthor;
