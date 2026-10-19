
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./blogitem.css";

const BlogItem = ({
  _id,
  title,
  cover,
  category,
  content,
  readTime,
  featured = false
}) => {
  const [imageError, setImageError] = useState(false);

  const hasImage = Boolean(cover) && !imageError;

  const description = content
    ?.replace(/<[^>]*>/g, "")
    .slice(0, 150);

  return (
    <Link
      to={`/blog/${_id}`}
      className={`magazine-card ${
        featured ? "magazine-card-featured" : ""
      }`}
    >
      <div className="magazine-card-image">
        {hasImage ? (
          <img
            src={cover}
            alt={title}
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="magazine-image-placeholder">
            <span>DANI DEV BLOG</span>
          </div>
        )}
      </div>

      <div className="magazine-card-content">
        <span className="magazine-category">
          {category || "EDITORIALE"}
        </span>

        <h3>{title}</h3>

        {description && (
          <p className="magazine-description">
            {description}
            {content?.length > 150 ? "..." : ""}
          </p>
        )}

        <div className="magazine-card-footer">
          <span>
            {readTime?.value
              ? `${readTime.value} ${
                  readTime.unit || "min"
                } di lettura`
              : "Dani Dev Blog"}
          </span>

          <span className="magazine-read-more">
            Leggi articolo →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BlogItem;
