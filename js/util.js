'use strict';

(function () {
  var DEBOUNCE = 500;
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var MAX_PINS = 5;
  var MAIN_PIN_HEIGHT = 80;
  var MAIN_PIN_WIDTH = 64;
  var MAIN_ROUND_PIN_SIZE = 66;
  var disabledElements = document.querySelectorAll('.ad-form fieldset, .map__filters select, .map__filters fieldset');
  var lastTimeout;
  var activePage = false;
  var adForm = document.querySelector('.ad-form');
  var address = adForm.querySelector('#address');
  var map = document.querySelector('.map');
  var mapFilters = map.querySelector('.map__filters');


  var debounce = function (cb) {
    if (lastTimeout) {
      clearTimeout(lastTimeout);
    }
    lastTimeout = setTimeout(cb, DEBOUNCE);
  };

  window.util = {
    ESC_KEYCODE: ESC_KEYCODE,
    ENTER_KEYCODE: ENTER_KEYCODE,
    MAX_PINS: MAX_PINS,
    MAIN_PIN_WIDTH: MAIN_PIN_WIDTH,
    MAIN_PIN_HEIGHT: MAIN_PIN_HEIGHT,
    MAIN_ROUND_PIN_SIZE: MAIN_ROUND_PIN_SIZE,
    disabledElements: disabledElements,
    debounce: debounce,
    adForm: adForm,
    activePage: activePage,
    address: address,
    mapFilters: mapFilters,
    map: map
  };

})();
