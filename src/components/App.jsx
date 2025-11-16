import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation} from 'react-router-dom';

import { CurrentUserContext } from '../contexts/CurrentUserContext';
import Header from "./Header/Header.jsx"
import Main from './Main.jsx';
import Footer from './Footer/Footer.jsx';
import Login from './Login/Login.jsx';
import Register from './Register/Register.jsx';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute.jsx';
import InfoTooltip from './InfoTooltip/InfoTooltip.jsx';
import Popup from './Main/components/Popup/Popup.jsx';
import NewCard from './Main/components/Popup/NewCard/NewCard.jsx';
import EditProfile from './Main/components/Popup/EditProfile/EditProfile.jsx';
import EditAvatar from './Main/components/Popup/EditAvatar/EditAvatar.jsx';
import ImagePopup from './Main/components/Popup/ImagePopup/ImagePopup.jsx';
import RemoveCard from './Main/components/Popup/RemoveCard/RemoveCard.jsx';

import api from '../utils/api';
import * as auth from '../utils/auth';
import { getToken, removeToken } from '../utils/token';



export default function App() {
  const [currentUser, setCurrentUser] = useState({
    name: '',
    about: '',
    avatar: '',
    _id: ''
  });
  const [cards, setCards] = useState([]);
  const [popup, setPopup] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardToDelete, setCardToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados de autenticación
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();


const handleRegister = (email, password) => {
    auth.register(email, password)
      .then((res) => {
        setIsSuccess(true);
        setIsInfoTooltipOpen(true);
        navigate('/signin');
      })
      .catch((err) => {
        console.log('Error en registro:', err);
        setIsSuccess(false);
        setIsInfoTooltipOpen(true);
      });
  };

  const handleLogin = (email, password) => {
    auth
    .login(email, password)
      .then((data) => {
        if (data.token) {
          localStorage.setItem('jwt', data.token);
          setLoggedIn(true);
          setUserEmail(email);
          loadAppData();
          navigate('/');
        }
      })
      .catch((err) => {
        console.log('Error en login:', err);
        setIsSuccess(false);
        setIsInfoTooltipOpen(true);
      });
  };

  

  const handleSignOut = () => {
    removeToken();
    setLoggedIn(false);
    setUserEmail('');
    setCurrentUser({
      name: '',
      about: '',
      avatar: '',
      _id: ''
    });
    setCards([]);
    navigate('/signin');
  };



  // Verificar token al cargar la app
  useEffect(() => {
    const token = getToken();
    if (token) {
      auth.checkToken(token)
        .then((res) => {
          setLoggedIn(true);
          setUserEmail(res.data.email);
          loadAppData();
        })
        .catch((err) => {
          console.log('Token inválido:', err);
          removeToken();
        });
    }
  }, []);

  // Cargar datos cuando el usuario esté logueado
  const loadAppData = () => {
    Promise.all([api.getUserInfo(), api.getInitialCards()])
      .then(([userData, cardsData]) => {
        setCurrentUser(userData || {});
        setCards(cardsData || []);
      })
      .catch((err) => {
        console.log(err);
        setCurrentUser({
          name: 'Usuario',
          about: 'Descripción',
          avatar: '',
          _id: ''
        });
        setCards([]);
      });
  };

  
  // Tus funciones existentes (handleCardLike, handleCardDelete, etc.)
  function handleCardLike(card) {
    const likeAction = card.isLiked
      ? api.unlikeCard(card._id)
      : api.likeCard(card._id);

    likeAction
      .then((updatedCard) => {
        setCards((prevCards) =>
          prevCards.map((c) => {
            if (c._id === card._id){
              return {
                ...c, isLiked: updatedCard.isLiked
              }
            } else {
              return c
            }
          })
        );
      })
      .catch((err) => {
        console.error("Error updating like:", err);
      });
  }

  function handleCardDelete(card) {
    setIsLoading(true);
    api.deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  }

  function handleUpdateUser(userData) {
    setIsLoading(true);
    api.updateUserInfo(userData)
      .then((newUserData) => {
        setCurrentUser(newUserData);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  }

  function handleUpdateAvatar(avatarData) {
    setIsLoading(true);
    api.updateAvatar(avatarData)
      .then((newUserData) => {
        setCurrentUser(newUserData);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  }

  function handleAddPlaceSubmit(cardData) {
    setIsLoading(true);
    api.addCard(cardData)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  }

  // Funciones de popups (tus funciones existentes)
  function handleEditAvatarClick() {
    setPopup({
      type: 'edit-avatar',
      title: 'Cambiar foto de perfil',
      component: 'edit-avatar'
    });
  }

  function handleEditProfileClick() {
    setPopup({
      type: 'edit-profile',
      title: 'Editar perfil',
      component: 'edit-profile'
    });
  }

  function handleAddPlaceClick() {
    setPopup({
      type: 'add-place',
      title: 'Nuevo lugar',
      component: 'add-place'
    });
  }

  function handleCardClick(card) {
    setSelectedCard(card);
    setPopup({
      type: 'image',
      title: null,
      component: 'image',
      card: card
    });
  }

  function handleDeleteClick(card) {
    setCardToDelete(card);
    setPopup({
      type: 'remove-card',
      title: '¿Estás seguro?',
      component: 'remove-card',
      card: card
    });
  }

  function closeAllPopups() {
    setPopup(null);
    setSelectedCard(null);
    setCardToDelete(null);
    setIsInfoTooltipOpen(false);
  }

  // Función para renderizar el componente correcto dentro del popup
  const renderPopupContent = () => {
    if (!popup) return null;

    switch (popup.component) {
      case 'edit-profile':
        return (
          <EditProfile 
            onUpdateUser={handleUpdateUser} 
            isLoading={isLoading}
            onClose={closeAllPopups}
          />
        );
      
      case 'add-place':
        return (
          <NewCard 
            onAddCard={handleAddPlaceSubmit} 
            isLoading={isLoading}
          />
        );
      
      case 'edit-avatar':
        return (
          <EditAvatar 
            onUpdateAvatar={handleUpdateAvatar} 
            isLoading={isLoading}
            onClose={closeAllPopups}
          />
        );
      
      case 'image':
        return (
          <ImagePopup card={popup.card} />
        );
      
      case 'remove-card':
        return (
          <RemoveCard 
            onConfirm={() => handleCardDelete(popup.card)}
            onCancel={closeAllPopups}
            isLoading={isLoading}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
  <div className="page__content">
    
    <Header email={userEmail} onSignOut={handleSignOut} />
    
    <Routes>
      <Route 
        path="/" 
        element={
          <ProtectedRoute loggedIn={loggedIn}>
            <Main 
              cards={cards}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleDeleteClick}
            />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/signin" 
        element={
          <ProtectedRoute anonymous={true} loggedIn={loggedIn}>
            <Login onLogin={handleLogin} />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/signup" 
        element={
          <ProtectedRoute anonymous={true} loggedIn={loggedIn}>
            <Register onRegister={handleRegister} />
          </ProtectedRoute>
        } 
      />
      
      <Route path="*" element={<Navigate to={loggedIn ? "/" : "/signin"} replace />} />
    </Routes>

    {loggedIn && <Footer />}

    {/* Popup único */}
    {popup && (
      <Popup 
        onClose={closeAllPopups} 
        title={popup.title}
      >
        {renderPopupContent()}
      </Popup>
    )}

    <InfoTooltip
      isOpen={isInfoTooltipOpen}
      onClose={closeAllPopups}
      isSuccess={isSuccess}
    />
  </div>
</CurrentUserContext.Provider>
  );
}