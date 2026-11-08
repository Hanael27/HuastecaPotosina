export default function Footer() {
  return (
    <footer className="footer">
      <p className="footer__text">
        &copy; {new Date().getFullYear()} Huasteca Potosina. Todos los derechos reservados.
      </p>
      <p className="footer__text">
        Sitio creado con <span lang="en">React</span> y <span lang="en">Redux Toolkit</span>.
      </p>
    </footer>
  );
}
