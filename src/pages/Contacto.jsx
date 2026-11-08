import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// Ids de cada campo: se usan en <label for>, aria-describedby y en el resumen de errores.
const IDS = {
  nombre: 'contacto-nombre',
  correo: 'contacto-correo',
  asunto: 'contacto-asunto',
  mensaje: 'contacto-mensaje',
  acepta: 'contacto-acepta',
};

const ASUNTOS = [
  { value: 'rutas', label: 'Rutas y destinos' },
  { value: 'gastronomia', label: 'Gastronomía' },
  { value: 'cultura', label: 'Cultura y tradiciones' },
  { value: 'otro', label: 'Otro tema' },
];

const TEMAS = [
  { value: 'historia', label: 'Historia' },
  { value: 'gastronomia', label: 'Gastronomía' },
  { value: 'musica', label: 'Música' },
  { value: 'cultura', label: 'Cultura' },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY_VALUES = {
  nombre: '',
  correo: '',
  asunto: '',
  mensaje: '',
  temas: [],
  acepta: false,
};

function validate(values) {
  const errors = {};
  if (!values.nombre.trim()) errors.nombre = 'Escribe tu nombre.';

  if (!values.correo.trim()) {
    errors.correo = 'Escribe tu correo electrónico.';
  } else if (!EMAIL_REGEX.test(values.correo.trim())) {
    errors.correo = 'El correo debe tener el formato nombre@dominio.com.';
  }

  if (!values.asunto) errors.asunto = 'Selecciona un asunto.';

  if (values.mensaje.trim().length < 10) {
    errors.mensaje = 'El mensaje debe tener al menos 10 caracteres.';
  }

  if (!values.acepta) errors.acepta = 'Debes aceptar el uso de tus datos para poder enviar.';
  return errors;
}

export default function Contacto() {
  const [values, setValues] = useState(EMPTY_VALUES);
  const [errors, setErrors] = useState({});
  const [submitCount, setSubmitCount] = useState(0);
  const [sent, setSent] = useState(false);
  const summaryRef = useRef(null);
  const successRef = useRef(null);

  const errorEntries = Object.entries(errors);

  // Tras un envío con errores el foco pasa al resumen; tras un envío correcto, al mensaje de éxito.
  useEffect(() => {
    if (submitCount > 0 && errorEntries.length > 0) summaryRef.current?.focus();
  }, [submitCount]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (sent) successRef.current?.focus();
  }, [sent]);

  const handleChange = (event) => {
    const { name, type, value, checked } = event.target;
    setValues((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleTemaChange = (event) => {
    const { value, checked } = event.target;
    setValues((prev) => ({
      ...prev,
      temas: checked ? [...prev.temas, value] : prev.temas.filter((tema) => tema !== value),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setSubmitCount((count) => count + 1);

    if (Object.keys(nextErrors).length === 0) {
      // Este sitio no tiene backend: aquí iría la petición (fetch/axios) que envía el mensaje.
      setSent(true);
    }
  };

  const handleReset = () => {
    setValues(EMPTY_VALUES);
    setErrors({});
    setSubmitCount(0);
    setSent(false);
  };

  const focusField = (event, field) => {
    event.preventDefault();
    document.getElementById(IDS[field])?.focus();
  };

  // Une las pistas y el mensaje de error de un campo en su aria-describedby.
  const describedBy = (field, hasHint = false) =>
    [hasHint && `${IDS[field]}-hint`, errors[field] && `${IDS[field]}-error`]
      .filter(Boolean)
      .join(' ') || undefined;

  const fieldError = (field) =>
    errors[field] && (
      <p className="form__error" id={`${IDS[field]}-error`}>
        <i className="fa-solid fa-circle-exclamation" aria-hidden="true" /> {errors[field]}
      </p>
    );

  return (
    <section id="section-contacto" className="section" aria-labelledby="title-contacto">
      <div className="section__header">
        <h2 className="section__title" id="title-contacto">
          Contacto
        </h2>
        <i className="fa-solid fa-envelope section__icon" aria-hidden="true" />
      </div>

      <div className="section__body">
        <p>
          ¿Quieres planear tu visita o tienes dudas sobre la región? Escríbenos y te
          responderemos lo antes posible.
        </p>

        {sent ? (
          <div className="form__success" role="status" tabIndex={-1} ref={successRef}>
            <h3>
              <i className="fa-solid fa-circle-check" aria-hidden="true" /> ¡Mensaje enviado!
            </h3>
            <p>
              Gracias, {values.nombre.trim()}. Te responderemos a {values.correo.trim()}.
            </p>
            <button type="button" className="form__btn form__btn--secondary" onClick={handleReset}>
              Enviar otro mensaje
            </button>
          </div>
        ) : (
          <form
            className="form"
            onSubmit={handleSubmit}
            noValidate
            aria-label="Formulario de contacto"
          >
            {errorEntries.length > 0 && (
              <div className="form__summary" role="alert" tabIndex={-1} ref={summaryRef}>
                <h3>
                  Hay {errorEntries.length}{' '}
                  {errorEntries.length === 1 ? 'campo por corregir' : 'campos por corregir'}
                </h3>
                <ul>
                  {errorEntries.map(([field, message]) => (
                    <li key={field}>
                      <a href={`#${IDS[field]}`} onClick={(event) => focusField(event, field)}>
                        {message}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="form__note">
              Los campos marcados con <span aria-hidden="true">*</span>
              <span className="sr-only">asterisco</span> son obligatorios.
            </p>

            <div className="form__group">
              <label htmlFor={IDS.nombre} className="form__label">
                Nombre completo <span aria-hidden="true">*</span>
              </label>
              <input
                id={IDS.nombre}
                name="nombre"
                type="text"
                className="form__control"
                autoComplete="name"
                required
                value={values.nombre}
                onChange={handleChange}
                aria-invalid={errors.nombre ? 'true' : undefined}
                aria-describedby={describedBy('nombre')}
              />
              {fieldError('nombre')}
            </div>

            <div className="form__group">
              <label htmlFor={IDS.correo} className="form__label">
                Correo electrónico <span aria-hidden="true">*</span>
              </label>
              <input
                id={IDS.correo}
                name="correo"
                type="email"
                className="form__control"
                autoComplete="email"
                required
                value={values.correo}
                onChange={handleChange}
                aria-invalid={errors.correo ? 'true' : undefined}
                aria-describedby={describedBy('correo', true)}
              />
              <p className="form__hint" id={`${IDS.correo}-hint`}>
                Ejemplo: nombre@dominio.com
              </p>
              {fieldError('correo')}
            </div>

            <div className="form__group">
              <label htmlFor={IDS.asunto} className="form__label">
                Asunto <span aria-hidden="true">*</span>
              </label>
              <select
                id={IDS.asunto}
                name="asunto"
                className="form__control"
                required
                value={values.asunto}
                onChange={handleChange}
                aria-invalid={errors.asunto ? 'true' : undefined}
                aria-describedby={describedBy('asunto')}
              >
                <option value="">Selecciona una opción</option>
                {ASUNTOS.map((asunto) => (
                  <option key={asunto.value} value={asunto.value}>
                    {asunto.label}
                  </option>
                ))}
              </select>
              {fieldError('asunto')}
            </div>

            <fieldset className="form__fieldset">
              <legend className="form__label">Temas que te interesan (opcional)</legend>
              <div className="form__checks">
                {TEMAS.map((tema) => (
                  <div className="form__check" key={tema.value}>
                    <input
                      id={`contacto-tema-${tema.value}`}
                      type="checkbox"
                      name="temas"
                      value={tema.value}
                      checked={values.temas.includes(tema.value)}
                      onChange={handleTemaChange}
                    />
                    <label htmlFor={`contacto-tema-${tema.value}`}>{tema.label}</label>
                  </div>
                ))}
              </div>
            </fieldset>

            <div className="form__group">
              <label htmlFor={IDS.mensaje} className="form__label">
                Mensaje <span aria-hidden="true">*</span>
              </label>
              <textarea
                id={IDS.mensaje}
                name="mensaje"
                className="form__control"
                rows={5}
                required
                value={values.mensaje}
                onChange={handleChange}
                aria-invalid={errors.mensaje ? 'true' : undefined}
                aria-describedby={describedBy('mensaje', true)}
              />
              <p className="form__hint" id={`${IDS.mensaje}-hint`}>
                Mínimo 10 caracteres.
              </p>
              {fieldError('mensaje')}
            </div>

            <div className="form__group">
              <div className="form__check">
                <input
                  id={IDS.acepta}
                  name="acepta"
                  type="checkbox"
                  required
                  checked={values.acepta}
                  onChange={handleChange}
                  aria-invalid={errors.acepta ? 'true' : undefined}
                  aria-describedby={describedBy('acepta')}
                />
                <label htmlFor={IDS.acepta}>
                  Acepto que usen mis datos solo para responder este mensaje{' '}
                  <span aria-hidden="true">*</span>
                </label>
              </div>
              {fieldError('acepta')}
            </div>

            <button type="submit" className="form__btn">
              <i className="fa-solid fa-paper-plane" aria-hidden="true" /> Enviar mensaje
            </button>
          </form>
        )}
      </div>

      <Link to="/" className="section__back">
        <i className="fa-solid fa-arrow-up" aria-hidden="true" /> Volver al inicio
      </Link>
    </section>
  );
}
