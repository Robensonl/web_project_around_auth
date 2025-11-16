import { useContext } from 'react';
import { CurrentUserContext } from '../../../contexts/CurrentUserContext';

function Card({ card, onCardClick, onCardLike, onCardDelete }) {
  const currentUser = useContext(CurrentUserContext);

  return (
    <li className="card">
      <img
        className="card__image"
        src={card.link}
        alt={card.name}
        onClick={onCardClick}
      />
      <button
        aria-label="Eliminar tarjeta"
        className="card__delete-button"
        type="button"
        onClick={() => onCardDelete(card)}
      />
      <div className="card__description">
        <h2 className="card__title">{card.name}</h2>
        <div className="card__like-container">
          <button
            aria-label="Dar like"
            type="button"
            className={`card__like-button ${
              card.isLiked ? "card__like-button card__like-button_active"
    : "card__like-button"}`}
            onClick={() => onCardLike(card)}
          />
        </div>
      </div>
    </li>
  );
}

export default Card;