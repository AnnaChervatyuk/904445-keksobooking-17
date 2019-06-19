'use strict';

var TYPE_OFFER = ['palace', 'flat', 'house', 'bungalo'];
var OFFER_QUANTITY = 8;
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var MIN_PIN_COORDS_Y = 130;
var MAX_PIN_COORDS_Y = 630;
var MIN_PIN_COORDS_X = 0;
var MAX_PIN_COORDS_X = document.querySelector('.map__pins').clientWidth;
var templatePin = document.querySelector('#pin').content.querySelector('.map__pin');
var pinList = document.querySelector('.map__pins');

document.querySelector('.map').classList.remove('map--faded');

var getRandomElement = function () {
  var randomElement = Math.floor(Math.random() * TYPE_OFFER.length);
  return randomElement;
};

var getRandomNumber = function (min, max) {
  var randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber;
};

var createOffers = function (offerQuantity) {
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
};


var createPinMock = function (pinInfo) {
  var pinMock = templatePin.cloneNode(true);
  pinMock.style.left = pinInfo.location.x + 'px';
  pinMock.style.top = pinInfo.location.y + 'px';
  pinMock.querySelector('img').src = pinInfo.author.avatar;
  pinMock.querySelector('img').alt = pinInfo.offer.type;
  return pinMock;
};

var allOffers = createOffers(OFFER_QUANTITY);

var getPins = function () {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < OFFER_QUANTITY; i++) {
    fragment.appendChild(createPinMock(allOffers[i]));
  }
  pinList.appendChild(fragment);
};

getPins();
