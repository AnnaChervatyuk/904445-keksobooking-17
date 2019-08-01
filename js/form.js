'use strict';

(function () {
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

  var CAPACITY_ON_ROOMS = {
    1: [1],
    2: [1, 2],
    3: [1, 2, 3],
    100: [0]
  };

  // текст ошибки при несоответсиви количества комнат и гостей
  var getCapacityError = function (room, capacity) {
    var result = '';
    if (Number(room.value) < Number(capacity.value)) {
      result = 'комнат меньше, чем гостей';
    } else {
      if (room.value === '100' || capacity.value === '0') {
        result = '100 комнат предназначены не для гостей';
      }
    }
    return result;
  };

  // Проверка количества комнат и гостей
  var checkRoomAndCapacity = function () {
    if (CAPACITY_ON_ROOMS[roomNumber.value].indexOf(parseInt(сapacityNumber.value, 10)) === -1) {
      roomNumber.setCustomValidity(getCapacityError(roomNumber, сapacityNumber));
    } else {
      roomNumber.setCustomValidity('');
    }
  };

  var getMainAddress = function (width, height) {
    var x = START_POINTS_MAIN_PIN.left + width / 2;
    var y = START_POINTS_MAIN_PIN.top + height;
    return (x + ', ' + y);
  };

  var getDisabledElements = function (arr) {
    for (var i = 0; i < arr.length; i++) {
      arr[i].disabled = true;
    }
  };

  var getTimeElement = function (firstTimeElement, secondTimeElement) {
    secondTimeElement.value = firstTimeElement.options[firstTimeElement.selectedIndex].value;
  };

  var checkPrice = function () {
    minPrice.setCustomValidity('');
  };

  // дезакцивация страницы
  var desactivatePage = function () {
    if (!document.querySelector('.map').classList.contains('map--faded')) {
      document.querySelector('.map').classList.add('map--faded');
    }

    if (!window.util.adForm.classList.contains('ad-form--disabled')) {
      window.util.adForm.classList.add('ad-form--disabled');
    }
    getDisabledElements(window.util.DISABLED_ELEMENTS);
  };

  var timeIn = document.querySelector('#timein');
  var timeOut = document.querySelector('#timeout');
  var selectTypeFlat = document.querySelector('#type');
  var minPrice = document.querySelector('#price');
  var сapacityNumber = document.querySelector('#capacity');
  var roomNumber = document.querySelector('#room_number');
  var resetButton = document.querySelector('.ad-form__reset');
  var submitButton = document.querySelector('.ad-form__submit');

  window.util.adForm.addEventListener('change', function () {
    checkPrice();
    checkRoomAndCapacity();
  });

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

  // кнопка сброса формы
  resetButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    window.util.adForm.reset();
    window.card.deleteRenderedCard();
    window.pin.removePins();
    window.util.mapFilters.reset();
    window.pin.moveMainPinToCenter();
    desactivatePage();
    window.util.activePage = false;
  });

  submitButton.addEventListener('click', function () {
    var formData = new FormData(window.util.adForm);
    window.load.save(formData, window.message.onSuccess, window.message.onError);
  });

  window.util.address.value = getMainAddress(window.util.MAIN_PIN_WIDTH, window.util.MAIN_PIN_HEIGHT);
  getDisabledElements(window.util.DISABLED_ELEMENTS);

  window.form = {
    'desactivatePage': desactivatePage
  };
})();
