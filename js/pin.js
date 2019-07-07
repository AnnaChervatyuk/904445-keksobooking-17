'use strict';

(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var MAIN_PIN_HEIGHT = 87;
  var MAIN_PIN_WIDTH = 64;
  var MIN_PIN_COORDS_Y = 130;
  var MAX_PIN_COORDS_Y = 630;
  var MIN_PIN_COORDS_X = 0;
  var MAX_PIN_COORDS_X = document.querySelector('.map__pins').clientWidth;
  var TYPE_OFFER = ['palace', 'flat', 'house', 'bungalo'];
  var OFFER_QUANTITY = 8;
  var templatePin = document.querySelector('#pin').content.querySelector('.map__pin');
  var pinList = document.querySelector('.map__pins');

  function createOffers(offerQuantity) {
    var arrayOffers = [];
    for (var i = 0; i < offerQuantity; i++) {
      arrayOffers.push({
        'author': {
          'avatar': 'img/avatars/user0' + (i + 1) + '.png'
        },
        'offer': {
          'type': window.util.getRandomElement(TYPE_OFFER)
        },
        'location': {
          'x': window.util.getRandomNumber(MIN_PIN_COORDS_X - PIN_WIDTH / 2, MAX_PIN_COORDS_X - PIN_WIDTH / 2),
          'y': window.util.getRandomNumber(MIN_PIN_COORDS_Y - PIN_HEIGHT, MAX_PIN_COORDS_Y - PIN_HEIGHT)
        }
      });
    }
    return arrayOffers;
  }
  var allOffers = createOffers(OFFER_QUANTITY);

  function createPinMock(pinInfo) {
    var pinMock = templatePin.cloneNode(true);
    pinMock.style.left = pinInfo.location.x + 'px';
    pinMock.style.top = pinInfo.location.y + 'px';
    pinMock.querySelector('img').src = pinInfo.author.avatar;
    pinMock.querySelector('img').alt = pinInfo.offer.type;
    return pinMock;
  }

  function getMainAddressNew(width, height, pin) {
    var x = pin.offsetLeft + width / 2;
    var y = pin.offsetTop + height;
    return (x + ', ' + y);
  }

  function getEnabledElements(arr) {
    for (var i = 0; i < arr.length; i++) {
      arr[i].disabled = false;
    }
  }

  var pinMainHandler = document.querySelector('.map__pin--main');

  pinMainHandler.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    if (!window.form.activePage) {
      getEnabledElements(window.form.DISABLED_ELEMENTS);
      document.querySelector('.map').classList.remove('map--faded');
      document.querySelector('.ad-form').classList.remove('ad-form--disabled');
      window.form.activePage = true;
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

  function getPins() {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < OFFER_QUANTITY; i++) {
      fragment.appendChild(createPinMock(allOffers[i]));
    }
    pinList.appendChild(fragment);
  }

  getPins();

  window.pin = {
    'MAIN_PIN_WIDTH': MAIN_PIN_WIDTH,
    'MAIN_PIN_HEIGHT': MAIN_PIN_HEIGHT
  };

})();
