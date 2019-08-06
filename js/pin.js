'use strict';

(function () {
  var MIN_PIN_COORDS_Y = 130;
  var MAX_PIN_COORDS_Y = 630;
  var MIN_PIN_COORDS_X = 0;
  var MAX_PIN_COORDS_X = document.querySelector('.map__pins').clientWidth;
  var templatePin = document.querySelector('#pin').content.querySelector('.map__pin');
  var pinContainer = window.util.map.querySelector('.map__pins');
  var pinMain = pinContainer.querySelector('.map__pin--main');
  var fillArr = [];
  var mainPinStartCoords = {
    x: pinMain.offsetLeft,
    y: pinMain.offsetTop
  };

  //  создается пин объявления
  var createPin = function (pinInfo) {
    var pin = templatePin.cloneNode(true);
    var pinImg = pin.querySelector('img');
    pin.style.left = pinInfo.location.x + 'px';
    pin.style.top = pinInfo.location.y + 'px';
    pinImg.src = pinInfo.author.avatar;
    pinImg.alt = pinInfo.offer.type;

    pin.addEventListener('click', function (evt) {
      evt.preventDefault();
      window.card.changeCard(pinInfo);
      pin.classList.add('map__pin--active');
    });

    return pin;
  };

  // рассчет адреса главного пина после движения
  var getMainAddressNew = function (width, height, pin) {
    var x = pin.offsetLeft + width / 2;
    var y = pin.offsetTop + height;
    return (x + ', ' + y);
  };

  // разблокировка заблокированных полей при первом нажатии главного пина
  var enableElements = function (arr) {
    for (var i = 0; i < arr.length; i++) {
      arr[i].disabled = false;
    }
  };

  //  создание массива пинов
  var renderPins = function (allOffers) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < allOffers.length; i++) {
      fragment.appendChild(createPin(allOffers[i]));
    }
    pinContainer.appendChild(fragment);
  };


  // перезагрузка при ошибки сервера
  var errorLoading = function () {
    var errorPopup = document.querySelector('#error').content.querySelector('.error');
    var refreshPage = function () {
      window.location.reload();
    };

    var closeErrorPopup = function () {
      errorPopup.remove();
    };

    var closeErrorPopupOnEsc = function (evtKey) {
      if (evtKey.keyCode === window.util.ESC_KEYCODE) {
        evtKey.preventDefault();
        closeErrorPopup();
        refreshPage();
      }
    };

    document.body.appendChild(errorPopup);
    document.addEventListener('keydown', closeErrorPopupOnEsc);

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
    pinMain.style.top = mainPinStartCoords.y + 'px';
    pinMain.style.left = mainPinStartCoords.x + 'px';
    window.util.address.value = getMainAddressNew(window.util.MAIN_PIN_WIDTH, window.util.MAIN_PIN_HEIGHT, pinMain);
  };

  // загрузка и первичная отрисовка пинов
  var loadAndRenderPins = function (allOffers) {
    for (var i = 0; i < allOffers.length; i++) {
      var pinsElement = allOffers[i];
      fillArr.push(pinsElement);
    }
    renderPins(allOffers.slice(0, window.util.MAX_PINS));
    activatePage();
    return fillArr;
  };

  // разблокировка страницы
  var activatePage = function () {
    enableElements(window.util.disabledElements);
    window.util.map.classList.remove('map--faded');
    window.util.adForm.classList.remove('ad-form--disabled');
  };

  // вычисления координат после перемещения галвного пина + разблокировка страницы при первом передвижении пина мышью
  pinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    if (!window.util.activePage) {
      window.load.load(loadAndRenderPins, errorLoading);
      window.util.activePage = true;
      window.util.address.value = window.form.getMainAddress(window.util.MAIN_PIN_WIDTH, window.util.MAIN_PIN_HEIGHT, pinMain);
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

      var pinTopY = Math.max((MIN_PIN_COORDS_Y), Math.min((MAX_PIN_COORDS_Y), (pinMain.offsetTop - shift.y)));
      var pinTopX = Math.max((MIN_PIN_COORDS_X - window.util.MAIN_PIN_WIDTH / 2), Math.min((MAX_PIN_COORDS_X - window.util.MAIN_PIN_WIDTH / 2), (pinMain.offsetLeft - shift.x)));

      pinMain.style.top = pinTopY + 'px';
      pinMain.style.left = pinTopX + 'px';

      window.util.address.value = getMainAddressNew(window.util.MAIN_PIN_WIDTH, window.util.MAIN_PIN_HEIGHT, pinMain);
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
  pinMain.addEventListener('keydown', function (evt) {
    evt.preventDefault();
    if (evt.keyCode === window.util.ENTER_KEYCODE) {
      if (!window.util.activePage) {
        enableElements(window.util.disabledElements);
        window.util.map.classList.remove('map--faded');
        window.util.adForm.classList.remove('ad-form--disabled');
        window.load.load(loadAndRenderPins, errorLoading);
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
