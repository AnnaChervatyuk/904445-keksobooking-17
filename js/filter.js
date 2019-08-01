'use strict';

(function () {

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
  var currentHousingGuests = housingGuests.value;
  var currentHousingRooms = housingRooms.value;
  var PricesType = {
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

  var checkType = function (allOffers) {
    currentHousingType = housingType.options[housingType.selectedIndex].value;
    if (currentHousingType !== 'any') {
      return allOffers.offer.type === currentHousingType;
    }
    return true;
  };

  var checkGuests = function (allOffers) {
    currentHousingGuests = housingGuests.options[housingGuests.selectedIndex].value;
    if (currentHousingGuests !== 'any') {
      return allOffers.offer.guests.toString() === currentHousingGuests;
    }
    return true;
  };

  var checkRooms = function (allOffers) {
    currentHousingRooms = housingRooms.options[housingRooms.selectedIndex].value;
    if (currentHousingRooms !== 'any') {
      return allOffers.offer.rooms.toString() === currentHousingRooms;
    }
    return true;
  };

  var checkPrice = function (allOffers) {
    var currentHousingPrice = PricesType[housingPrice.value];
    return allOffers.offer.price >= currentHousingPrice.min && allOffers.offer.price <= currentHousingPrice.max;
  };

  var checkFeatures = function (input, allOffers) {
    return (!input.checked) || (allOffers.offer.features.indexOf(input.value) !== -1);
  };


  window.util.mapFilters.addEventListener('change', function () {
    window.util.debounce(function () {
      window.card.deleteRenderedCard();
      window.pin.removePins();
      var filteredOffers = window.pin.fillArr.filter(checkTotal).slice(0, window.util.MAX_PINS);
      window.pin.renderPins(filteredOffers);
    });
  });

})();
