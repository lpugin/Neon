/** @module DisplayPanel/DisplayControls */

import * as Color from '../utils/Color.js';
import Icons from '../img/icons.svg';

const $ = require('jquery');

/**
 * Initialize listeners and controls for display panel.
 * @param {string} meiClassName - The class used to signifiy the MEI element(s).
 * @param {string} background - The class used to signify the background.
 */
export function initDisplayControls (meiClassName, background) {
  setOpacityControls(meiClassName);
  setBackgroundOpacityControls(background);
  setHighlightControls();
  setBurgerControls();

  $('#toggleDisplay').on('click', () => {
    if ($('#displayContents').is(':hidden')) {
      $('#displayContents').css('display', '');
      $('#toggleDisplay').attr('xlink:href', Icons + '#dropdown-down');
    } else {
      $('#displayContents').css('display', 'none');
      $('#toggleDisplay').attr('xlink:href', Icons + '#dropdown-side');
    }
  });
}

/**
 * Set zoom control listener for button and slider
 * @param {ZoomHandler} zoomHandler - The zoomHandler, if it exists.
 */
export function setZoomControls (zoomHandler) {
  if (zoomHandler === undefined) {
    return;
  }
  $('#zoomSlider').val(100);
  $('#reset-zoom').click(() => {
    $('#zoomOutput').val(100);
    $('#zoomSlider').val(100);
    zoomHandler.resetZoomAndPan();
  });

  $(document).on('input change', '#zoomSlider', () => {
    $('#zoomOutput').val($('#zoomSlider').val());
    zoomHandler.zoomTo($('#zoomOutput').val() / 100.0);
  });

  $('body').on('keydown', (evt) => {
    let currentZoom = parseInt($('#zoomOutput').val());
    if (evt.key === '+') { // increase zoom by 20
      let newZoom = Math.min(currentZoom + 20, parseInt($('#zoomSlider').attr('max')));
      zoomHandler.zoomTo(newZoom / 100.0);
      $('#zoomOutput').val(newZoom);
      $('#zoomSlider').val(newZoom);
    } else if (evt.key === '-') { // decrease zoom by 20
      let newZoom = Math.max(currentZoom - 20, parseInt($('#zoomSlider').attr('min')));
      zoomHandler.zoomTo(newZoom / 100.0);
      $('#zoomOutput').val(newZoom);
      $('#zoomSlider').val(newZoom);
    } else if (evt.key === '0') {
      $('#zoomOutput').val(100);
      $('#zoomSlider').val(100);
      zoomHandler.resetZoomAndPan();
    }
  });
}

/**
 * Set rendered MEI opacity button and slider listeners.
 * @param {string} meiClassName
 */
function setOpacityControls (meiClassName) {
  $('#opacitySlider').val(100);
  $('#reset-opacity').click(function () {
    // Definition scale is the root element of what is generated by verovio
    Array.from(document.getElementsByClassName(meiClassName)).forEach(elem => {
      elem.style.opacity = 1;
    });
    $('.definition-scale').css('opacity', 1);

    $('#opacitySlider').val(100);
    $('#opacityOutput').val(100);
  });

  $(document).on('input change', '#opacitySlider', () => {
    $('#opacityOutput').val($('#opacitySlider').val());
    $('.' + meiClassName).css('opacity', $('#opacityOutput').val() / 100.0);
  });
}

/**
 * Update MEI opacity to value from the slider.
 * @param {string} meiClassName
 */
export function setOpacityFromSlider (meiClassName) {
  $('#opacityOutput').val($('#opacitySlider').val());
  $('.' + meiClassName).css('opacity', $('#opacityOutput').val() / 100.0);
}

/**
 * Set background image opacity button and slider listeners.
 * @param {string} background
 */
function setBackgroundOpacityControls (background) {
  $('#bgOpacitySlider').val(100);
  $('#reset-bg-opacity').click(function () {
    document.getElementsByClassName(background)[0].style.opacity = 1;

    $('#bgOpacitySlider').val(100);
    $('#bgOpacityOutput').val(100);
  });

  $(document).on('input change', '#bgOpacitySlider', function () {
    $('#bgOpacityOutput').val(parseInt($('#bgOpacitySlider').val()));
    document.getElementsByClassName(background)[0].style.opacity = $('#bgOpacityOutput').val() / 100.0;
  });
}

/**
 * Set listener on staff highlighting checkbox.
 */
export function setHighlightControls () {
  $('#highlight-button').on('click', (evt) => {
    evt.stopPropagation();
    $('#highlight-dropdown').toggleClass('is-active');
    if ($('#highlight-dropdown').hasClass('is-active')) {
      $('body').one('click', highlightClickaway);
      $('#highlight-staff').on('click', () => {
        $('#highlight-dropdown').removeClass('is-active');
        $('.highlight-selected').removeClass('highlight-selected');
        $('#highlight-staff').addClass('highlight-selected');
        $('#highlight-type').html('&nbsp;- Staff');
        Color.setGroupingHighlight('staff');
      });
      $('#highlight-syllable').on('click', () => {
        $('#highlight-dropdown').removeClass('is-active');
        $('.highlight-selected').removeClass('highlight-selected');
        $('#highlight-syllable').addClass('highlight-selected');
        $('#highlight-type').html('&nbsp;- Syllable');
        Color.setGroupingHighlight('syllable');
      });
      $('#highlight-neume').on('click', () => {
        $('#highlight-dropdown').removeClass('is-active');
        $('.highlight-selected').removeClass('highlight-selected');
        $('#highlight-neume').addClass('highlight-selected');
        $('#highlight-type').html('&nbsp;- Neume');
        Color.setGroupingHighlight('neume');
      });
      $('#highlight-none').on('click', () => {
        $('#highlight-dropdown').removeClass('is-active');
        $('.highlight-selected').removeClass('highlight-selected');
        $('#highlight-type').html('&nbsp;- Off');
        Color.unsetGroupingHighlight();
      });
    } else {
      $('body').off('click', highlightClickaway);
    }
  });
}

/**
 * Reset the highlight for different types based on the 'highlight-selected' class in the DOM.
 */
export function updateHighlight () {
  let highlightId = $('.highlight-selected').attr('id');
  switch (highlightId) {
    case 'highlight-staff':
      Color.setGroupingHighlight('staff');
      break;
    case 'highlight-syllable':
      Color.setGroupingHighlight('syllable');
      break;
    case 'highlight-neume':
      Color.setGroupingHighlight('neume');
      break;
    default:
      Color.unsetGroupingHighlight();
  }
}

/**
 * Set listener on burger menu for smaller screens.
 */
function setBurgerControls () {
  $('#burgerMenu').on('click', () => {
    $(this).toggleClass('is-active');
    $('#navMenu').toggleClass('is-active');
  });
}

/**
 * Clickaway listener for the highlight dropdown.
 */
function highlightClickaway () {
  $('body').off('click', highlightClickaway);
  $('#highlight-dropdown').removeClass('is-active');
}