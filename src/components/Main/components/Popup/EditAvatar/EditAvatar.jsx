import { useState } from 'react';

function EditAvatar({ onUpdateAvatar, isLoading, onClose }) {
  const [avatar, setAvatar] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateAvatar({ avatar });
  }

  return (
    <form className="popup__form" name="avatar-form" id="edit-avatar-form"
      noValidate onSubmit={handleSubmit}>
      <label className="popup__field">
        <input
          className="popup__input popup__input_type_url"
          id="avatar-link"
          name="avatar"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
          required
          type="url"
          placeholder="image link"
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

export default EditAvatar;