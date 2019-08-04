'use strict';

(function () {
  var FlatPrices = {
    'bungalo': 0,
    'house': 5000,
    'flat': 1000,
    'palace': 10000
  };
  var StartPointsMainPin = {
    'LEFT': 570,
    'TOP': 375
  };

  var title = window.util.adForm.querySelector('#title');
  var timeIn = window.util.adForm.querySelector('#timein');
  var timeOut = window.util.adForm.querySelector('#timeout');
  var selectTypeFlat = window.util.adForm.querySelector('#type');
  var minPrice = window.util.adForm.querySelector('#price');
  var сapacityNumber = window.util.adForm.querySelector('#capacity');
  var roomNumber = window.util.adForm.querySelector('#room_number');
  var resetButton = window.util.adForm.querySelector('.ad-form__reset');
  var submitButton = window.util.adForm.querySelector('.ad-form__submit');

  // устанавливаю значения по умолчанию для количества мест в одной комнате
  var getсapacityNumber = function () {
    сapacityNumber.value = '1';
    for (var i = 0; i < сapacityNumber.children.length; i++) {
      сapacityNumber.children[i].disabled = true;
    }
    сapacityNumber.querySelector('option[value="1"]').disabled = false;
  };

  getсapacityNumber();

  // блокирую поля с неподхожяим кол-вом гостей к выбранным комнатам
  roomNumber.addEventListener('change', function () {
    for (var i = 0; i < сapacityNumber.children.length; i++) {
      сapacityNumber.children[i].disabled = true;
    }
    if (roomNumber.value === '1') {
      сapacityNumber.querySelector('option[value="1"]').disabled = false;
    } else if (roomNumber.value === '2') {
      сapacityNumber.querySelector('option[value="1"]').disabled = false;
      сapacityNumber.querySelector('option[value="2"]').disabled = false;
    } else if (roomNumber.value === '3') {
      сapacityNumber.querySelector('option[value="1"]').disabled = false;
      сapacityNumber.querySelector('option[value="2"]').disabled = false;
      сapacityNumber.querySelector('option[value="3"]').disabled = false;
    } else {
      сapacityNumber.querySelector('option[value="0"]').disabled = false;
    }
    сapacityNumber.value = roomNumber.value !== '100' ? '1' : '0';
  });

  // функция проверки заголовка или цены
  var checkField = function (field) {
    if (!field.checkValidity()) {
      submitButton.click();
      field.setCustomValidity('');
    }
  };

  var getMainStartAddress = function (size) {
    var x = StartPointsMainPin.LEFT + size / 2;
    var y = StartPointsMainPin.TOP + size / 2;
    return (x + ', ' + y);
  };

  var getMainAddress = function (width, height) {
    var x = StartPointsMainPin.LEFT + width / 2;
    var y = StartPointsMainPin.TOP + height;
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

  // дезакцивация страницы
  var getDeactivatedPage = function () {
    if (!window.util.map.classList.contains('map--faded')) {
      window.util.map.classList.add('map--faded');
    }

    if (!window.util.adForm.classList.contains('ad-form--disabled')) {
      window.util.adForm.classList.add('ad-form--disabled');
    }
    getDisabledElements(window.util.disabledElements);
    window.util.address.value = getMainStartAddress(window.util.MAIN_ROUND_PIN_SIZE);
  };

  selectTypeFlat.addEventListener('change', function () {
    var valueFlat = selectTypeFlat.options[selectTypeFlat.selectedIndex].value;
    minPrice.min = FlatPrices[valueFlat];
    minPrice.placeholder = minPrice.min;
    minPrice.setCustomValidity('');
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
    getDeactivatedPage();
    getсapacityNumber();
    window.util.activePage = false;
  });

  title.addEventListener('change', function () {
    checkField(title);
  });

  minPrice.addEventListener('change', function () {
    checkField(minPrice);
  });

  submitButton.addEventListener('click', function (evt) {
    if (window.util.adForm.checkValidity()) {
      evt.preventDefault();
      var formData = new FormData(window.util.adForm);
      window.load.save(formData, window.message.onSuccess, window.message.onError);
    }
  });

  getDisabledElements(window.util.disabledElements);
  window.util.address.value = getMainStartAddress(window.util.MAIN_ROUND_PIN_SIZE);

  window.form = {
    getMainAddress: getMainAddress,
    getDeactivatedPage: getDeactivatedPage,
    getсapacityNumber: getсapacityNumber
  };

})();
