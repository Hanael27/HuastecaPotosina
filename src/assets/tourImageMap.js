// Aislado en su propio módulo para poder mockearlo fácilmente en Jest.
const tourImages = import.meta.glob('./img/tour/*.{jpg,jpeg,png}', {
  eager: true,
  import: 'default',
});

export default tourImages;
