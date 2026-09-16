import { useDispatch, useSelector } from 'react-redux';
import { selectShowWelcome, closeWelcome } from '../store/uiSlice';
import { selectSitio } from '../store/contentSlice';
import guiaImg from '../assets/img/Guia.webp';

export default function WelcomeOverlay() {
  const dispatch = useDispatch();
  const showWelcome = useSelector(selectShowWelcome);
  const sitio = useSelector(selectSitio);

  if (!showWelcome) return null;

  return (
    <div
      className="welcome"
      id="welcome-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
    >
      <img src={guiaImg} alt="Guía Xochitl" className="welcome__image" />

      <p className="welcome__text" id="welcome-title">
        {sitio.bienvenida}
      </p>

      <button
        className="welcome__btn"
        type="button"
        onClick={() => dispatch(closeWelcome())}
      >
        <i className="fa-solid fa-compass" aria-hidden="true" /> Comenzar recorrido
      </button>
    </div>
  );
}
