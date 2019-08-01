'use strict';

(function () {
  var MIN_PIN_COORDS_Y = 130;
  var MAX_PIN_COORDS_Y = 630;
  var MIN_PIN_COORDS_X = 0;
  var MAX_PIN_COORDS_X = document.querySelector('.map__pins').clientWidth;
  var pinMainHandler = document.querySelector('.map__pin--main');
  var templatePin = document.querySelector('#pin').content.querySelector('.map__pin');
  var pinList = document.querySelector('.map__pins');
  var fillArr = [];
  var mainPinStartCoords = {
    x: pinMainHandler.offsetLeft,
    y: pinMainHandler.offsetTop
  };

  //  создается пин объявления
  var createPinMock = function (pinInfo) {
    var pinMock = templatePin.cloneNode(true);
    pinMock.style.left = pinInfo.location.x + 'px';
    pinMock.style.top = pinInfo.location.y + 'px';
    pinMock.querySelector('img').src = pinInfo.author.avatar;
    pinMock.querySelector('img').alt = pinInfo.offer.type;

    pinMock.addEventListener('click', function (evt) {
      evt.preventDefault();
      window.card.changeCard(pinInfo);
      pinMock.classList.add('map__pin--active');
    });

    return pinMock;
  };

  // рассчет адреса главного пина после движения
  var getMainAddressNew = function (width, height, pin) {
    var x = pin.offsetLeft + width / 2;
    var y = pin.offsetTop + height;
    return (x + ', ' + y);
  };

  // разблокировка заблокированных полей при первом нажатии главного пина
  var getEnabledElements = function (arr) {
    for (var i = 0; i < arr.length; i++) {
      arr[i].disabled = false;
    }
  };

  //  создание массива пинов
  var renderPins = function (allOffers) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < allOffers.length; i++) {
      fragment.appendChild(createPinMock(allOffers[i]));
    }
    pinList.appendChild(fragment);
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
      if (evtKey.keyCode === window.util.ESC_KEYCODE) {
        evtKey.preventDefault();
        closeErrorPopup();
        refreshPage();
      }
    };

    document.body.appendChild(errorPopup);
    document.addEventListener('keydown', onPopupEscPress);

    errorPopup.addEventListener('click', function () {
      closeErrorPopup();
      refreshPage();
    });
  };

  // удаление пинов, кроме главного
  var removePins = function () {
    var renderedPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    renderedPins.forEach(function (value) {
      value.remove();
    });
  };

  // перемещение главного пина в центр
  var moveMainPinToCenter = function () {
    pinMainHandler.style.top = mainPinStartCoords.y + 'px';
    pinMainHandler.style.left = mainPinStartCoords.x + 'px';
    window.util.address.value = getMainAddressNew(window.util.MAIN_PIN_WIDTH, window.util.MAIN_PIN_HEIGHT, pinMainHandler);
  };


  var loadAndRender = function (allOffers) {
    for (var i = 0; i < allOffers.length; i++) {
      var pinsElement = allOffers[i];
      fillArr.push(pinsElement);
    }
    renderPins(allOffers.slice(0, window.util.MAX_PINS));
    return fillArr;
  };

  // вычисления координат после перемещения галвного пина + разблокировка страницы при первом передвижении пина мышью
  pinMainHandler.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    if (!window.util.activePage) {
      getEnabledElements(window.util.DISABLED_ELEMENTS);
      document.querySelector('.map').classList.remove('map--faded');
      document.querySelector('.ad-form').classList.remove('ad-form--disabled');
      window.load.load(loadAndRender, errorHandler);
      window.util.activePage = true;
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

      var pinTopY = Math.max((MIN_PIN_COORDS_Y), Math.min((MAX_PIN_COORDS_Y), (pinMainHandler.offsetTop - shift.y)));
      var pinTopX = Math.max((MIN_PIN_COORDS_X - window.util.MAIN_PIN_WIDTH / 2), Math.min((MAX_PIN_COORDS_X - window.util.MAIN_PIN_WIDTH / 2), (pinMainHandler.offsetLeft - shift.x)));

      pinMainHandler.style.top = pinTopY + 'px';
      pinMainHandler.style.left = pinTopX + 'px';

      window.util.address.value = getMainAddressNew(window.util.MAIN_PIN_WIDTH, window.util.MAIN_PIN_HEIGHT, pinMainHandler);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  // разблокировка страницы при первом клике на enter
  pinMainHandler.addEventListener('keydown', function (evt) {
    evt.preventDefault();
    if (evt.keyCode === window.util.ENTER_KEYCODE) {
      if (!window.util.activePage) {
        getEnabledElements(window.util.DISABLED_ELEMENTS);
        document.querySelector('.map').classList.remove('map--faded');
        document.querySelector('.ad-form').classList.remove('ad-form--disabled');
        window.load.load(loadAndRender, errorHandler);
        window.util.activePage = true;
      }
    }
  });

  window.pin = {
    renderPins: renderPins,
    removePins: removePins,
    moveMainPinToCenter: moveMainPinToCenter,
    fillArr: fillArr
  };

})();
