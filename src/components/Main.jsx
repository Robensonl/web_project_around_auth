import { useState, useEffect, useContext } from "react";
import Card from "../components/Main/Card/Card.jsx";
import Popup from "../components/Main/components/Popup/Popup.jsx";
import NewCard from "../components/Main/components/Popup/NewCard/NewCard";
import EditProfile from "../components/Main/components/Popup/EditProfile/EditProfile";
import EditAvatar from "../components/Main/components/Popup/EditAvatar/EditAvatar";
import ImagePopup from "../components/Main/components/Popup/ImagePopup/ImagePopup";
import RemoveCard from "../components/Main/components/Popup/RemoveCard/RemoveCard";
import { CurrentUserContext } from "../../src/contexts/CurrentUserContext";
import api from '../utils/api';


function Main({
  cards,
  onEditProfile,
  onAddPlace,
  onEditAvatar,
  onCardLike,
  onCardDelete,
  onCardClick
}) {
  const currentUser = useContext(CurrentUserContext);
  const [popup, setPopup] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handlers de popups
  function handleOpenPopup(name, card = null) {
    setSelectedCard(card);
    setPopup(name);
  }

  function handleClosePopup() {
    setPopup(null);
    setSelectedCard(null);
  }

  // Handlers de datos
  function handleUpdateUser({ name, about }) {
    setIsLoading(true);
    api.updateUserInfo({ name, about })
      .then(() => {
        handleClosePopup();
      })
      .catch((err) => console.error("Error updating user:", err))
      .finally(() => setIsLoading(false));
  }

  function handleUpdateAvatar({ avatar }) {
    setIsLoading(true);
    api.updateAvatar({ avatar })
      .then(() => {
        handleClosePopup();
      })
      .catch((err) => console.error("Error updating avatar:", err))
      .finally(() => setIsLoading(false));
  }

  function handleAddCard({ name, link }) {
    setIsLoading(true);
    api.addCard({ name, link })
      .then(() => {
        handleClosePopup();
      })
      .catch((err) => console.error("Error adding card:", err))
      .finally(() => setIsLoading(false));
  }

  function handleCardDeleteConfirm(card) {
    setIsLoading(true);
    api.deleteCard(card._id)
      .then(() => {
        handleClosePopup();
      })
      .catch((err) => console.error("Error deleting card:", err))
      .finally(() => setIsLoading(false));
  }

  return (
    <main className="main">
      <section className="profile">
        <div className="profile__avatar-container">
          <img
            src={currentUser?.avatar || null} 
            alt="Avatar de usuario"
            className="profile__avatar"
          />
          <button
            aria-label="Editar avatar"
            className="profile__avatar-edit"
            type="button"
            onClick={onEditAvatar}
          />
        </div>

        <div className="profile__info">
          <div className="profile__name-container">
            <h1 className="profile__name">{currentUser?.name || ''}</h1>
            <button
              aria-label="Editar perfil"
              className="profile__edit-button"
              type="button"
              onClick={onEditProfile}
            />
          </div>
          <p className="profile__about">{currentUser?.about || ''}</p>
        </div>

        <button
          aria-label="Agregar tarjeta"
          className="profile__add-button"
          type="button"
          onClick={onAddPlace}
        />
      </section>

      {/* -------- Tarjetas -------- */}
      <section className="cards">
        <ul className="cards__list">
          {cards && cards.map((card) => (
            <Card
              key={card._id}
              card={card}
              onCardClick={() => onCardClick(card)}
              onCardLike={onCardLike}
              onCardDelete={() => onCardDelete(card)}
            />
          ))}
        </ul>
      </section>

      {/* -------- Popups -------- */}
      {popup === "editProfile" && (
        <Popup onClose={handleClosePopup} title="Editar perfil">
          <EditProfile
            currentUser={currentUser}
            onUpdateUser={handleUpdateUser}
            isLoading={isLoading}
          />
        </Popup>
      )}

      {popup === "newCard" && (
        <Popup onClose={handleClosePopup} title="Nuevo lugar">
          <NewCard onAddCard={handleAddCard} isLoading={isLoading} />
        </Popup>
      )}

      {popup === "editAvatar" && (
        <Popup onClose={handleClosePopup} title="Cambiar foto de perfil">
          <EditAvatar
            onUpdateAvatar={handleUpdateAvatar}
            isLoading={isLoading}
          />
        </Popup>
      )}

      {popup === "image" && (
        <Popup onClose={handleClosePopup} title={null}>
          <ImagePopup card={selectedCard} />
        </Popup>
      )}

      {popup === "removeCard" && (
        <Popup onClose={handleClosePopup} title="¿Estás seguro?">
          <RemoveCard
            onConfirm={() => handleCardDeleteConfirm(selectedCard)}
            onCancel={handleClosePopup}
            isLoading={isLoading}
          />
        </Popup>
      )}
    </main>
  );
}

export default Main;