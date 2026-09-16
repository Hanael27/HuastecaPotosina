import { useSelector } from 'react-redux';
import { selectSitio } from '../store/contentSlice';
import escudoSLP from '../assets/img/EscudoSLP.png';

export default function Header() {
  const sitio = useSelector(selectSitio);

  return (
    <header className="header" id="top">
      <img src={escudoSLP} alt="Escudo de San Luis Potosí" className="header__flag" />
      <h1 className="header__title">{sitio.titulo}</h1>
      <p className="header__subtitle">{sitio.subtitulo}</p>
    </header>
  );
}
