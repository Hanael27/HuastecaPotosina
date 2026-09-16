import axios from 'axios';

/**
 * Cliente Axios para la API pública y gratuita de Pixabay
 * (https://pixabay.com/api/docs/).
 *
 * Pixabay no requiere backend ni cabeceras especiales: basta con
 * una API key gratuita (se obtiene creando una cuenta) que se
 * envía como query param. Por eso puede llamarse directamente
 * desde el navegador sin problemas de CORS.
 *
 * La key se lee de la variable de entorno VITE_PIXABAY_API_KEY
 * (ver .env.example). Si no está configurada, el slice de Redux
 * recurre automáticamente a las imágenes locales del proyecto,
 * así la app funciona "out of the box" para revisión/demo.
 */
const PIXABAY_API_KEY = import.meta.env.VITE_PIXABAY_API_KEY || '';
const BASE_URL = 'https://pixabay.com/api/';

export const pixabayClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export function hasPixabayKey() {
  return Boolean(PIXABAY_API_KEY);
}

/**
 * Busca imágenes en Pixabay para un término dado.
 * @param {string} query - término de búsqueda (ej. "Xilitla jungle")
 * @param {number} perPage - cuántas imágenes traer (3-200)
 * @returns {Promise<Array<{id:number, tags:string, imageUrl:string, previewUrl:string, user:string, pageUrl:string}>>}
 */
export async function searchImages(query, perPage = 3) {
  const { data } = await pixabayClient.get('', {
    params: {
      key: PIXABAY_API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: Math.max(perPage, 3), // Pixabay exige un mínimo de 3
    },
  });

  return (data.hits || []).map((hit) => ({
    id: hit.id,
    tags: hit.tags,
    imageUrl: hit.largeImageURL || hit.webformatURL,
    previewUrl: hit.previewURL,
    user: hit.user,
    pageUrl: hit.pageURL,
  }));
}
