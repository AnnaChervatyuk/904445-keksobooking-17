'use strict';

(function () {

  var MAX_PINS = 5;
  var housingType = document.querySelector('#housing-type');
  var housingPrice = document.querySelector('#housing-price');
  var housingGuests = document.querySelector('#housing-guests');
  var housingRooms = document.querySelector('#housing-rooms');
  var wifi = document.querySelector('#filter-wifi');
  var dishwasher = document.querySelector('#filter-dishwasher');
  var parking = document.querySelector('#filter-parking');
  var washer = document.querySelector('#filter-washer');
  var elevator = document.querySelector('#filter-elevator');
  var conditioner = document.querySelector('#filter-conditioner');
  var currentHousingType = housingType.value;
  var currenthousingGuests = housingGuests.value;
  var currenthousingRooms = housingRooms.value;
  var pricesType = {
    'low': {
      min: 0,
      max: 10000
    },
    'middle': {
      min: 10000,
      max: 50000
    },
    'high': {
      min: 50000,
      max: Infinity
    },
    'any': {
      min: 0,
      max: Infinity
    }
  };
  var mapFilters = document.querySelector('.map__filters');

  var checkTotal = function (allOffers) {
    return checkType(allOffers) &&
              checkGuests(allOffers) &&
              checkRooms(allOffers) &&
              checkPrice(allOffers) &&
              checkFeatures(wifi, allOffers) &&
              checkFeatures(dishwasher, allOffers) &&
              checkFeatures(parking, allOffers) &&
              checkFeatures(elevator, allOffers) &&
              checkFeatures(conditioner, allOffers) &&
              checkFeatures(washer, allOffers);
  };


  mapFilters.addEventListener('change', function () {
    window.card.deleteRenderedCard();
    window.pin.removePins();
    var filteredOffers = window.pin.pinsArr.filter(checkTotal).slice(0, MAX_PINS);
    window.pin.renderPins(filteredOffers);
  });


  var checkType = function (allOffers) {
    currentHousingType = housingType.options[housingType.selectedIndex].value;
    if (currentHousingType !== 'any') {
      return allOffers.offer.type === currentHousingType;
    }
    return true;
  };

  var checkGuests = function (allOffers) {
    currenthousingGuests = housingGuests.options[housingGuests.selectedIndex].value;
    if (currenthousingGuests !== 'any') {
      return allOffers.offer.guests.toString() === currenthousingGuests;
    }
    return true;
  };

  var checkRooms = function (allOffers) {
    currenthousingRooms = housingRooms.options[housingRooms.selectedIndex].value;
    if (currenthousingRooms !== 'any') {
      return allOffers.offer.rooms.toString() === currenthousingRooms;
    }
    return true;
  };


  var checkPrice = function (allOffers) {
    var currentHousingPrice = pricesType[housingPrice.value];
    return allOffers.offer.price >= currentHousingPrice.min && allOffers.offer.price <= currentHousingPrice.max;
  };

  var checkFeatures = function (input, allOffers) {
    return (!input.checked) || (allOffers.offer.features.indexOf(input.value) !== -1);
  };


  window.filter = {
    'MAX_PINS': MAX_PINS
  };

})();
