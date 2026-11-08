// Marca con el atributo `lang` las palabras que no son español, para que los
// lectores de pantalla las pronuncien con la fonética correcta (WCAG 3.1.2).
// Para agregar otro término, solo añádelo a este objeto.
const LANG_TERMS = {
  Xóchitl: 'nah', // náhuatl: "flor"
  huehues: 'nah', // náhuatl: "viejos", danzantes del Xantolo
};

const PATTERN = new RegExp(`(${Object.keys(LANG_TERMS).join('|')})`, 'g');

export default function markLanguages(text) {
  return text.split(PATTERN).map((part, index) =>
    LANG_TERMS[part] ? (
      <span key={index} lang={LANG_TERMS[part]}>
        {part}
      </span>
    ) : (
      part
    )
  );
}
