import { useState } from 'react';

function NewCard({ onAddCard, isLoading }) {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    onAddCard({ name, link });
  }

  return (
    <form className="popup__form" name="card-form" id='nwe-card-form' noValidate onSubmit={handleSubmit}>
      <label className="popup__field">
        <input
          className="popup__input popup__input_type_title_card-name"
          id='card-name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength="2"
          maxLength="30"
          name='card-name'
          type="text"
          placeholder="Title"
          disabled={isLoading}
        />
        <span className="popup__error" id='card-name-error'></span>
      </label>
      <label className="popup__field">
        <input
          className="popup__input popup__input_type_url"
          id='card-link'
          name='link'
          value={link}
          onChange={(e) => setLink(e.target.value)}
          required
          type="url"
          placeholder="image link"
          disabled={isLoading}
        />
        <span className="popup__error" id='card-link-error'></span>
      </label>
      <button 
        className="button popup__button" 
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "Creando..." : "Crear"}
      </button>
    </form>
  );
}

export default NewCard;