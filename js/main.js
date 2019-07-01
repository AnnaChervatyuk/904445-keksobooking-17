'use strict';

var TYPE_OFFER = ['palace', 'flat', 'house', 'bungalo'];
var OFFER_QUANTITY = 8;
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var MAIN_PIN_HEIGHT = 87;
var MAIN_PIN_WIDTH = 65;
var MIN_PIN_COORDS_Y = 130;
var MAX_PIN_COORDS_Y = 630;
var MIN_PIN_COORDS_X = 0;
var MAX_PIN_COORDS_X = document.querySelector('.map__pins').clientWidth;
var DISABLED_ELEMENTS = document.querySelectorAll('.ad-form fieldset, .map__filters select, .map__filters fieldset');
var PRICES_FLATS = {
  'bungalo': 0,
  'house': 5000,
  'flat': 1000,
  'palace': 10000
};


function getRandomElement() {
  var randomElement = Math.floor(Math.random() * TYPE_OFFER.length);
  return randomElement;
}

function getRandomNumber(min, max) {
  var randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber;
}

function createOffers(offerQuantity) {
  var arrayOffers = [];
  for (var i = 0; i < offerQuantity; i++) {
    arrayOffers.push({
      'author': {
        'avatar': 'img/avatars/user0' + (i + 1) + '.png'
      },
      'offer': {
        'type': getRandomElement(TYPE_OFFER)
      },
      'location': {
        'x': getRandomNumber(MIN_PIN_COORDS_X, MAX_PIN_COORDS_X - PIN_WIDTH / 2),
        'y': getRandomNumber(MIN_PIN_COORDS_Y, MAX_PIN_COORDS_Y - PIN_HEIGHT)
      }
    });
  }
  return arrayOffers;
}

function getMainAddress(width, height) {
  var x = MAX_PIN_COORDS_X - width / 2;
  var y = MAX_PIN_COORDS_Y - height;
  return (x + ', ' + y);
}

function createPinMock(pinInfo) {
  var pinMock = templatePin.cloneNode(true);
  pinMock.style.left = pinInfo.location.x + 'px';
  pinMock.style.top = pinInfo.location.y + 'px';
  pinMock.querySelector('img').src = pinInfo.author.avatar;
  pinMock.querySelector('img').alt = pinInfo.offer.type;
  return pinMock;
}

var allOffers = createOffers(OFFER_QUANTITY);

function getPins() {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < OFFER_QUANTITY; i++) {
    fragment.appendChild(createPinMock(allOffers[i]));
  }
  pinList.appendChild(fragment);
}

function getDisabledElements(arr) {
  for (var i = 0; i < arr.length; i++) {
    arr[i].disabled = true;
  }
}

function getEnabledElements(arr) {
  for (var i = 0; i < arr.length; i++) {
    arr[i].disabled = false;
  }
}

function getTimeElement(firstTimeElement, secondTimeElement) {
  secondTimeElement.value = firstTimeElement.options[firstTimeElement.selectedIndex].value;
}

function checkPrice() {
  minPrice.setCustomValidity('');
}

function getMainAddressNew(width, height, pin, shift) {
  var x = (pin.offsetLeft - shift.x) + width / 2;
  var y = (pin.offsetTop - shift.y) + height;
  return (x + ', ' + y);
}


// var pinMain = document.querySelector('.map__pin--main');
var pinMainHandler = document.querySelector('.map__pin--main');
var activePage = false;
var templatePin = document.querySelector('#pin').content.querySelector('.map__pin');
var pinList = document.querySelector('.map__pins');
var selectTypeFlat = document.querySelector('#type');
var minPrice = document.querySelector('#price');
var timeIn = document.querySelector('#timein');
var timeOut = document.querySelector('#timeout');
var address = document.querySelector('#address');

// pinMain.addEventListener('click', function () {
//  if (!activePage) {
//    getEnabledElements(DISABLED_ELEMENTS);
//    document.querySelector('.map').classList.remove('map--faded');
//    document.querySelector('.ad-form').classList.remove('ad-form--disabled');
//    activePage = true;
//  }
// });

pinMainHandler.addEventListener('mousedown', function (evt) {
  evt.preventDefault();
  if (!activePage) {
    getEnabledElements(DISABLED_ELEMENTS);
    document.querySelector('.map').classList.remove('map--faded');
    document.querySelector('.ad-form').classList.remove('ad-form--disabled');
    activePage = true;
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
    pinMainHandler.style.top = (pinMainHandler.offsetTop - shift.y) + 'px';
    pinMainHandler.style.left = (pinMainHandler.offsetLeft - shift.x) + 'px';

    if ((pinMainHandler.offsetTop - shift.y) <= MIN_PIN_COORDS_X) {
      pinMainHandler.style.top = MIN_PIN_COORDS_X;
    } else if ((pinMainHandler.offsetTop - shift.y) >= MAX_PIN_COORDS_Y) {
      pinMainHandler.style.top = MAX_PIN_COORDS_Y + 'px';
    } else if ((pinMainHandler.offsetLeft - shift.x) <= (0 - MAIN_PIN_WIDTH / 2)) {
      pinMainHandler.style.left = (0 - MAIN_PIN_WIDTH / 2) + 'px';
    } else if ((pinMainHandler.offsetLeft - shift.x + MAIN_PIN_WIDTH / 2) >= MAX_PIN_COORDS_X) {
      pinMainHandler.style.left = (MAX_PIN_COORDS_X - MAIN_PIN_WIDTH / 2) + 'px';
    }

    address.value = getMainAddressNew(MAIN_PIN_WIDTH, MAIN_PIN_HEIGHT, pinMainHandler, shift);
  };

  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
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


address.value = getMainAddress(MAIN_PIN_WIDTH, MAIN_PIN_HEIGHT);

getDisabledElements(DISABLED_ELEMENTS);
getPins();
