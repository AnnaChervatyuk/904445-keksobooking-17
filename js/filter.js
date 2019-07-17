'use strict';

(function () {
  var MAX_PINS = 5;
  var housingType = document.querySelector('#housing-type');
  var currentHousingType = housingType.value;
  var filteredOffers = [];

  housingType.addEventListener('change', function () {
    currentHousingType = housingType.options[housingType.selectedIndex].value;
    filterOffers();
    window.pin.renderPins(filteredOffers);
  });


  var filterOffers = function () {
    window.pin.removePins();
    filteredOffers = window.pin.pinsArr.filter(function (it) {
      if (currentHousingType !== 'any') {
        return it.offer.type === currentHousingType;
      }
      return true;
    });

    filteredOffers = filteredOffers.slice(0, MAX_PINS);
    return filteredOffers;
  };

  window.filter = {
    'MAX_PINS': MAX_PINS
  };

})();
