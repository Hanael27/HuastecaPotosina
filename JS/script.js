/*
 * script.js — Lógica principal de la página Huasteca Potosina
 * Dependencias:
 *   - jQuery 3.x
 *   - Bootstrap 5
 */

$(document).ready(function () {

  // 1. CARGAR DATOS DESDE data.json
  $.getJSON('JS/data.json', function (data) {
    initPage(data);
  }).fail(function () {
    console.error('Error: No se pudo cargar JS/data.json. Verifica la ruta.');
  });

  // 2. INICIALIZACIÓN PRINCIPAL
  function initPage(data) {
    buildHero(data.sitio);
    buildHistoria(data.historia);
    buildGastronomia(data.gastronomia);
    buildMusica(data.musica);
    buildCultura(data.cultura);
    bindNav();          // Activa el toggle del nav después de construir el DOM
    bindWelcome();      // Maneja el modal de bienvenida
  }

  // 3. CONSTRUIR HERO
  function buildHero(sitio) {
    $('.header__title').text(sitio.titulo);
    $('.header__subtitle').text(sitio.subtitulo);
  }

  // 4. CONSTRUIR SECCIÓN HISTORIA
  function buildHistoria(historia) {
    var $body = $('#section-historia .section__body');
    $body.empty(); // Limpia contenido previo

    // Itera sobre cada párrafo del array y lo agrega al DOM
    $.each(historia.parrafos, function (i, parrafo) {
      $body.append($('<p>').text(parrafo));
    });
  }

  // 5. CONSTRUIR SECCIÓN GASTRONOMÍA
  function buildGastronomia(gastronomia) {
    var $grid = $('#section-gastronomia .food-grid');
    $grid.empty();

    $.each(gastronomia.platillos, function (i, platillo) {
      // Construir la tarjeta con BEM
      var $card = $('<article>').addClass('food-card');

      // Contenedor de imagen
      var $imgWrap = $('<div>').addClass('food-card__image-wrap');

      // Si el platillo tiene imagen asignada, la usa; si no, muestra placeholder
      var $img = $('<img>')
        .addClass('food-card__image')
        .attr('src', platillo.imagen)
        .attr('alt', platillo.nombre)
        .on('error', function () {
          // Si la imagen no carga, reemplaza con placeholder visual
          $(this).replaceWith(buildImagePlaceholder(platillo.nombre));
        });

      $imgWrap.append($img);

      // Cuerpo de la tarjeta
      var $body = $('<div>').addClass('food-card__body');
      var $nombre = $('<h3>').addClass('food-card__name').text(platillo.nombre);
      var $desc = $('<p>').addClass('food-card__desc').text(platillo.descripcion);

      $body.append($nombre, $desc);
      $card.append($imgWrap, $body);
      $grid.append($card);
    });
  }

  // 6. CONSTRUIR SECCIÓN MÚSICA
  function buildMusica(musica) {
    // Descripción introductoria
    $('#section-musica .section__description').text(musica.descripcion);

    var $tbody = $('#music-tbody');
    $tbody.empty();

    $.each(musica.canciones, function (i, cancion) {
      var $tr = $('<tr>').addClass('music-table__row');

      // Celda: número de orden
      var $tdNum = $('<td>').text(i + 1);

      // Celda: título y artista
      var $tdInfo = $('<td>');
      $tdInfo.append(
        $('<strong>').text(cancion.titulo),
        $('<br>'),
        $('<small>').text(cancion.artista).css('color', '#777')
      );

      // Celda: botón enlace a YouTube
      var $tdLink = $('<td>');
      var $link = $('<a>')
        .addClass('music-table__link')
        .attr('href', cancion.youtube)
        .attr('target', '_blank')        // Abre en pestaña nueva
        .attr('rel', 'noopener noreferrer') // Seguridad al abrir en nueva pestaña
        .html('<i class="fab fa-youtube"></i> Ver en YouTube');

      $tdLink.append($link);
      $tr.append($tdNum, $tdInfo, $tdLink);
      $tbody.append($tr);
    });
  }

  // 7. CONSTRUIR SECCIÓN CULTURA
  function buildCultura(cultura) {
    var $grid = $('#section-cultura .culture-grid');
    $grid.empty();

    $.each(cultura.bloques, function (i, bloque) {
      var $block = $('<div>').addClass('culture-block');
      var $title = $('<h3>').addClass('culture-block__title').html(
        '<i class="fa-solid ' + bloque.icono + '"></i> ' + bloque.titulo
      );
      var $text = $('<p>').addClass('culture-block__text').text(bloque.texto);

      $block.append($title, $text);
      $grid.append($block);
    });
  }

  // 8. TOGGLE DE SECCIONES
  function bindNav() {
    $('.nav__link[data-section]').on('click', function (e) {
      e.preventDefault(); // Previene el salto de ancla nativo del navegador

      var targetId = $(this).data('section'); // Ej: "historia"
      var $target  = $('#section-' + targetId);
      var isAlreadyActive = $target.hasClass('is-active');

      // 1. Ocultar todas las secciones y desactivar todos los links del nav
      $('.section').removeClass('is-active');
      $('.nav__link').removeClass('is-active');

      // 2. Si la sección no estaba activa, activarla
      if (!isAlreadyActive) {
        $target.addClass('is-active');
        $(this).addClass('is-active');

        // Desplazarse suavemente hasta la sección abierta
        $('html, body').animate(
          { scrollTop: $target.offset().top - 70 }, // -70 compensa la nav fija
          400
        );
      }
      // Si ya estaba activa, el primer paso ya la cerró
    });
  }

  // 9. BIENVENIDA
  function bindWelcome() {
    $('#btn-close-welcome').on('click', function () {
      // Fade out del overlay de bienvenida
      $('.welcome').fadeOut(500, function () {
        $(this).remove(); // Lo elimina del DOM al terminar
      });
    });
  }

  // UTILIDAD: Placeholder de imagen
  function buildImagePlaceholder(nombre) {
    return $('<div>').addClass('img-placeholder').html(
      '<i class="fa-solid fa-image"></i><span>' + nombre + '</span>'
    );
  }

});
