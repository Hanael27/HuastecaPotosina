import { createSlice } from '@reduxjs/toolkit';
import siteData from '../data/siteData.json';

// El contenido "editorial" del sitio (historia, gastronomía, música, cultura)
// vive en un JSON local. Se carga una sola vez al iniciar el store y desde
// ahí los componentes lo consumen vía selectores, igual que harían con
// datos que vinieran de un backend.
const initialState = {
  sitio: siteData.sitio,
  historia: siteData.historia,
  gastronomia: siteData.gastronomia,
  musica: siteData.musica,
  cultura: siteData.cultura,
  destinos: siteData.destinos,
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {},
});

export const selectSitio = (state) => state.content.sitio;
export const selectHistoria = (state) => state.content.historia;
export const selectGastronomia = (state) => state.content.gastronomia;
export const selectMusica = (state) => state.content.musica;
export const selectCultura = (state) => state.content.cultura;
export const selectDestinos = (state) => state.content.destinos;

export default contentSlice.reducer;
