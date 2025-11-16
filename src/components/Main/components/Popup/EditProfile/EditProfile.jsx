import { useState, useContext, useEffect } from 'react';
import { CurrentUserContext } from '../../../../../contexts/CurrentUserContext';

function EditProfile({ onUpdateUser, isLoading, onClose }) {
  const currentUser = useContext(CurrentUserContext);
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setAbout(currentUser.about || '');
    }
  }, [currentUser]);

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateUser({ name, about });
  }

  return (
    <form className="popup__form" name="profile-form" onSubmit={handleSubmit}>
      <label className="popup__field">
        <input
          className="popup__input popup__input_type_name"
          onChange={(e) => setName(e.target.value)}
          required
          minLength="2"
          maxLength="40"
          type="text"
          placeholder="Nombre"
          disabled={isLoading}
        />
        <span className="popup__error"></span>
      </label>
      <label className="popup__field">
        <input
          className="popup__input popup__input_type_about"
          
          onChange={(e) => setAbout(e.target.value)}
          required
          minLength="2"
          maxLength="200"
          type="text"
          placeholder="Acerca de mí"
          disabled={isLoading}
        />
        <span className="popup__error"></span>
      </label>
      <button 
        className="popup__button" 
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
}

export default EditProfile;