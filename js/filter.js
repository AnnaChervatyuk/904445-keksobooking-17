'use strict';

(function () {

  var housingType = window.util.mapFilters.querySelector('#housing-type');
  var housingPrice = window.util.mapFilters.querySelector('#housing-price');
  var housingGuests = window.util.mapFilters.querySelector('#housing-guests');
  var housingRooms = window.util.mapFilters.querySelector('#housing-rooms');
  var wifi = window.util.mapFilters.querySelector('#filter-wifi');
  var dishwasher = window.util.mapFilters.querySelector('#filter-dishwasher');
  var parking = window.util.mapFilters.querySelector('#filter-parking');
  var washer = window.util.mapFilters.querySelector('#filter-washer');
  var elevator = window.util.mapFilters.querySelector('#filter-elevator');
  var conditioner = window.util.mapFilters.querySelector('#filter-conditioner');
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
    return (currentHousingType === 'any') || allOffers.offer.type === currentHousingType;
  };

  var checkGuests = function (allOffers) {
    currentHousingGuests = housingGuests.options[housingGuests.selectedIndex].value;
    return (currentHousingGuests === 'any') || allOffers.offer.guests.toString() === currentHousingGuests;
  };

  var checkRooms = function (allOffers) {
    currentHousingRooms = housingRooms.options[housingRooms.selectedIndex].value;
    return (currentHousingRooms === 'any') || allOffers.offer.rooms.toString() === currentHousingRooms;
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
