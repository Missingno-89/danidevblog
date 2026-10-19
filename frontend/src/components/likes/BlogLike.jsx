
import React, { useState } from "react";
import { AiOutlineLike } from "react-icons/ai";
import { Button } from "react-bootstrap";

const yourUserId = "123";

export default function BlogLike({
  defaultLikes = [],
  onChange
}) {
  const [likes, setLikes] = useState(defaultLikes);

  const iLikedThisArticle = likes.includes(yourUserId);

  const toggleLike = () => {
    let updatedLikes;

    if (iLikedThisArticle) {
      // Rimuoviamo il like
      updatedLikes = likes.filter(
        (id) => id !== yourUserId
      );
    } else {
      // Aggiungiamo il like
      updatedLikes = [...likes, yourUserId];
    }

    // Aggiorniamo lo stato React
    setLikes(updatedLikes);

    // Comunichiamo il nuovo valore al componente padre
    if (onChange) {
      onChange(updatedLikes);
    }
  };

  return (
    <div>
      <Button
        type="button"
        onClick={toggleLike}
        variant={
          iLikedThisArticle
            ? "dark"
            : "outline-dark"
        }
      >
        <AiOutlineLike /> {likes.length} like
      </Button>
    </div>
  );
}
