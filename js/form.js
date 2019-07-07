'use strict';

(function () {
  var DISABLED_ELEMENTS = document.querySelectorAll('.ad-form fieldset, .map__filters select, .map__filters fieldset');
  var PRICES_FLATS = {
    'bungalo': 0,
    'house': 5000,
    'flat': 1000,
    'palace': 10000
  };
  var START_POINTS_MAIN_PIN = {
    'left': 570,
    'top': 375
  };
  var timeIn = document.querySelector('#timein');
  var timeOut = document.querySelector('#timeout');
  var address = document.querySelector('#address');
  var selectTypeFlat = document.querySelector('#type');
  var minPrice = document.querySelector('#price');
  var activePage = false;

  function getMainAddress(width, height) {
    var x = START_POINTS_MAIN_PIN.left + width / 2;
    var y = START_POINTS_MAIN_PIN.top + height;
    return (x + ', ' + y);
  }


  function getDisabledElements(arr) {
    for (var i = 0; i < arr.length; i++) {
      arr[i].disabled = true;
    }
  }


  function getTimeElement(firstTimeElement, secondTimeElement) {
    secondTimeElement.value = firstTimeElement.options[firstTimeElement.selectedIndex].value;
  }

  function checkPrice() {
    minPrice.setCustomValidity('');
  }

  selectTypeFlat.addEventListener('change', function () {
    var valueFlat = selectTypeFlat.options[selectTypeFlat.selectedIndex].value;
    var priceTypeFlat = PRICES_FLATS[valueFlat];
    minPrice.placeholder = priceTypeFlat;
    minPrice.min = priceTypeFlat;
    checkPrice();
  });

  timeIn.addEventListener('change', function () {
    getTimeElement(timeIn, timeOut);
  });

  timeOut.addEventListener('change', function () {
    getTimeElement(timeOut, timeIn);
  });


  address.value = getMainAddress(window.pin.MAIN_PIN_WIDTH, window.pin.MAIN_PIN_HEIGHT);

  getDisabledElements(DISABLED_ELEMENTS);

  window.form = {
    'activePage': activePage,
    'DISABLED_ELEMENTS': DISABLED_ELEMENTS,
    'address': address,
  };
})();
