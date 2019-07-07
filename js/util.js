'use strict';

(function () {
  function getRandomElement(lenght) {
    var randomElement = Math.floor(Math.random() * lenght);
    return randomElement;
  }

  function getRandomNumber(min, max) {
    var randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber;
  }

  window.util = {
    'getRandomElement': getRandomElement,
    'getRandomNumber': getRandomNumber,
  };

})();
