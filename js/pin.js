'use strict';

(function () {
  var MAIN_PIN_HEIGHT = 87;
  var MAIN_PIN_WIDTH = 64;
  var MIN_PIN_COORDS_Y = 130;
  var MAX_PIN_COORDS_Y = 630;
  var MIN_PIN_COORDS_X = 0;
  var MAX_PIN_COORDS_X = document.querySelector('.map__pins').clientWidth;
  var ESC_KEYCODE = 27;

  //  создается пин объявления
  function createPinMock(pinInfo) {
    var pinMock = templatePin.cloneNode(true);
    pinMock.style.left = pinInfo.location.x + 'px';
    pinMock.style.top = pinInfo.location.y + 'px';
    pinMock.querySelector('img').src = pinInfo.author.avatar;
    pinMock.querySelector('img').alt = pinInfo.offer.type;
    return pinMock;
  }

  // рассчет адреса главного пина после движения
  function getMainAddressNew(width, height, pin) {
    var x = pin.offsetLeft + width / 2;
    var y = pin.offsetTop + height;
    return (x + ', ' + y);
  }

  // разблокировка заблокированных полей при первом нажатии главного пина
  function getEnabledElements(arr) {
    for (var i = 0; i < arr.length; i++) {
      arr[i].disabled = false;
    }
  }

  var pinMainHandler = document.querySelector('.map__pin--main');
  var templatePin = document.querySelector('#pin').content.querySelector('.map__pin');
  var pinList = document.querySelector('.map__pins');
  var pinsArr = [];

  //  создание массива пинов
  var renderPins = function (allOffers) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < allOffers.length; i++) {
      fragment.appendChild(createPinMock(allOffers[i]));
      var pinsElement = allOffers[i];
      pinsArr.push(pinsElement);
    }
    pinList.appendChild(fragment);
    var pinsButton = pinList.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var j = 0; j < pinsButton.length; j++) {
      pinsButton[j].querySelector('img').addEventListener('click', window.card.changeCard(allOffers[j]));
    }
    return pinsArr;
  };


  var successHandler = function (allOffers) {
    renderPins(allOffers);
    //  renderPins(allOffers.slice(0, 5));  // НЕ РАБОТАЕТ
  };


  // перезагрузка при ошибки сервера
  var errorHandler = function () {
    var errorPopup = document.querySelector('#error').content.querySelector('.error');

    var refreshPage = function () {
      window.location.reload();
    };

    var closeErrorPopup = function () {
      errorPopup.remove();
    };

    var onPopupEscPress = function (evtKey) {
      if (evtKey.keyCode === ESC_KEYCODE) {
        closeErrorPopup();
        refreshPage(); // не работает
      }
    };

    document.body.appendChild(errorPopup);
    document.addEventListener('keydown', onPopupEscPress);

    errorPopup.addEventListener('click', function () {
      closeErrorPopup();
      refreshPage();
    });
  };

  // разблокировка страницы при первом передвижении пина
  pinMainHandler.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    if (!window.form.activePage) {
      getEnabledElements(window.form.DISABLED_ELEMENTS);
      document.querySelector('.map').classList.remove('map--faded');
      document.querySelector('.ad-form').classList.remove('ad-form--disabled');
      window.form.activePage = true;
      window.load.load(successHandler, errorHandler);
    }

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };
      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var pinTopY = Math.max((MIN_PIN_COORDS_Y - MAIN_PIN_HEIGHT), Math.min((MAX_PIN_COORDS_Y - MAIN_PIN_HEIGHT), (pinMainHandler.offsetTop - shift.y)));
      var pinTopX = Math.max((MIN_PIN_COORDS_X - MAIN_PIN_WIDTH / 2), Math.min((MAX_PIN_COORDS_X - MAIN_PIN_WIDTH / 2), (pinMainHandler.offsetLeft - shift.x)));

      pinMainHandler.style.top = pinTopY + 'px';
      pinMainHandler.style.left = pinTopX + 'px';

      window.form.address.value = getMainAddressNew(MAIN_PIN_WIDTH, MAIN_PIN_HEIGHT, pinMainHandler);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  // удаление пинов, кроме главного
  var removePins = function () {
    var renderedPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    renderedPins.forEach(function (value) {
      value.remove();
    });
  };


  window.pin = {
    'MAIN_PIN_WIDTH': MAIN_PIN_WIDTH,
    'MAIN_PIN_HEIGHT': MAIN_PIN_HEIGHT,
    'pinsArr': pinsArr,
    'successHandler': successHandler,
    'renderPins': renderPins,
    'removePins': removePins,
    'ESC_KEYCODE': ESC_KEYCODE
  };

})();
