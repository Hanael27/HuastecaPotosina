/*
 * Quest/QScript.js — Mapa interactivo de la Huasteca Potosina
 * Dependencias:
 *   - jQuery 3.x
 *   - JS/data.json
 */

$(document).ready(function () {

  // 1. CARGAR DATOS DEL JSON
  $.getJSON('../JS/data.json', function (data) {
    initQuest(data.quest);
  }).fail(function () {
    console.error('Error: No se pudo cargar JS/data.json desde Quest.html.');
  });

  // 2. INICIALIZAR EL QUEST
  function initQuest(quest) {
    buildGuide(quest.guia);
    buildMapButtons(quest.lugares);
    bindGuideClose();
    bindPopupClose();
  }

  // 3. CONSTRUIR GUÍA DE BIENVENIDA
  function buildGuide(guia) {
    $('#guide-image').attr('src', '../' + guia.imagen).attr('alt', guia.nombre);
    $('.guide-text').text(guia.descripcion);
  }

  // 4. CONSTRUIR BOTONES EN EL MAPA
  function buildMapButtons(lugares) {
    var $mapContainer = $('#map-container');

    $.each(lugares, function (i, lugar) {
      var $btn = $('<button>')
        .addClass('location-btn')           // BEM: location-btn
        .attr('id', 'btn-' + lugar.id)
        .attr('data-id', lugar.id)          // ID del lugar para el popup
        .attr('data-info', lugar.info)      // Texto informativo
        .attr('data-nombre', lugar.nombre)
        .attr('data-imagen', '../' + lugar.imagen)
        .css({
          top:  lugar.top,   // Posición vertical del botón sobre el mapa
          left: lugar.left   // Posición horizontal del botón sobre el mapa
        })
        .text(lugar.nombre);

      $mapContainer.append($btn);
    });

    // Activar el click en todos los botones de lugar
    bindLocationButtons();
  }

  // 5. CLICK EN BOTÓN DE LUGAR
  function bindLocationButtons() {
    // Delegación de eventos para capturar botones creados dinámicamente
    $('#map-container').on('click', '.location-btn', function () {
      var nombre  = $(this).data('nombre');
      var info    = $(this).data('info');
      var imagen  = $(this).data('imagen');

      // Rellenar el popup con los datos del lugar clickeado
      $('#popup-nombre').text(nombre);
      $('#popup-info').text(info);

      // Mostrar imagen del lugar en el popup
      // IMAGEN: La ruta viene de data.json → quest.lugares[n].imagen
      $('#popup-imagen')
        .attr('src', imagen)
        .attr('alt', nombre)
        .on('error', function () {
          // Si no carga la imagen, oculta el elemento de imagen
          $(this).hide();
        }).show();

      // Guía también aparece en el popup
      $('#popup-guide-image').attr('src', $('#guide-image').attr('src'));

      // Mostrar popup con animación fadeIn
      $('#info-popup').removeClass('hidden').hide().fadeIn(300);
    });
  }

  // 6. CERRAR EL POPUP DE GUÍA DE BIENVENIDA
  function bindGuideClose() {
    $('#close-guide').on('click', function () {
      $('#welcome-guide').fadeOut(400);
    });
  }

  // 7. CERRAR EL POPUP DE INFORMACIÓN DE LUGAR
  function bindPopupClose() {
    $('#close-popup').on('click', function () {
      $('#info-popup').fadeOut(300, function () {
        $(this).addClass('hidden');
      });
    });
  }

});
