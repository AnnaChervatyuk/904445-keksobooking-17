'use strict';

(function () {
  var DEBOUNCE = 500;
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var MAX_PINS = 5;
  var DISABLED_ELEMENTS = document.querySelectorAll('.ad-form fieldset, .map__filters select, .map__filters fieldset');
  var MAIN_PIN_HEIGHT = 87;
  var MAIN_PIN_WIDTH = 64;
  var lastTimeout;
  var activePage = false;
  var adForm = document.querySelector('.ad-form');
  var address = document.querySelector('#address');
  var mapFilters = document.querySelector('.map__filters');


  var debounce = function (cb) {
    if (lastTimeout) {
      clearTimeout(lastTimeout);
    }
    lastTimeout = setTimeout(cb, DEBOUNCE);
  };

  var getRandomElement = function (lenght) {
    var randomElement = Math.floor(Math.random() * lenght);
    return randomElement;
  };

  var getRandomNumber = function (min, max) {
    var randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber;
  };

  window.util = {
    'getRandomElement': getRandomElement,
    'getRandomNumber': getRandomNumber,
    'ESC_KEYCODE': ESC_KEYCODE,
    'ENTER_KEYCODE': ENTER_KEYCODE,
    'MAX_PINS': MAX_PINS,
    'MAIN_PIN_WIDTH': MAIN_PIN_WIDTH,
    'MAIN_PIN_HEIGHT': MAIN_PIN_HEIGHT,
    'DISABLED_ELEMENTS': DISABLED_ELEMENTS,
    'debounce': debounce,
    'adForm': adForm,
    'activePage': activePage,
    'address': address,
    'mapFilters': mapFilters
  };

})();
