import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectShowWelcome, closeWelcome } from '../store/uiSlice';
import { selectSitio } from '../store/contentSlice';
import guiaImg from '../assets/img/Guia.webp';

export default function WelcomeOverlay() {
  const dispatch = useDispatch();
  const showWelcome = useSelector(selectShowWelcome);
  const sitio = useSelector(selectSitio);
  const buttonRef = useRef(null);

  // Al abrir el diálogo el foco pasa al botón; con Escape se cierra.
  useEffect(() => {
    if (!showWelcome) return undefined;
    buttonRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') dispatch(closeWelcome());
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [showWelcome, dispatch]);

  if (!showWelcome) return null;

  return (
    <div
      className="welcome"
      id="welcome-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
      aria-describedby="welcome-text"
    >
      <img
        src={guiaImg}
        alt="Xochitl, una cotorra de corona roja que es la guía del sitio"
        className="welcome__image"
      />

      <h2 className="sr-only" id="welcome-title">
        Bienvenida
      </h2>
      <p className="welcome__text" id="welcome-text">
        {sitio.bienvenida}
      </p>

      <button
        ref={buttonRef}
        className="welcome__btn"
        type="button"
        onClick={() => dispatch(closeWelcome())}
      >
        <i className="fa-solid fa-compass" aria-hidden="true" /> Comenzar recorrido
      </button>
    </div>
  );
}
