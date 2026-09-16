// Aislado en su propio módulo para poder mockearlo fácilmente en Jest,
// ya que import.meta.glob es una macro específica de Vite que no
// existe fuera de su bundler.
const comidaImages = import.meta.glob('./img/comida/*.{jpg,jpeg,png}', {
  eager: true,
  import: 'default',
});

export default comidaImages;
