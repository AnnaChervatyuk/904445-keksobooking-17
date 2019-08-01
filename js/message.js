'use strict';

(function () {
  var templateMessage = document.querySelector('#success').content.querySelector('.success');
  var templateErrorMessage = document.querySelector('#error').content.querySelector('.error');
  var successMessage;
  var errorMessage;
  var success = false;
  var error = false;

  // сообщение об успешной отправке
  var showMessage = function () {
    successMessage = templateMessage.cloneNode(true);
    document.querySelector('main').insertAdjacentElement('afterbegin', successMessage);
    document.querySelector('.success').addEventListener('click', onMessageClick);
    document.addEventListener('keydown', onMessageEscPress);
    success = true;
  };

  // сообщение об неуспешной отправке
  var showMessageError = function () {
    errorMessage = templateErrorMessage.cloneNode(true);
    document.querySelector('main').insertAdjacentElement('afterbegin', errorMessage);
    document.querySelector('.error').addEventListener('click', onMessageClick);
    document.addEventListener('keydown', onMessageEscPress);
    error = true;
  };

  // при успешной отправке
  var onSuccess = function () {
    showMessage();
    window.util.adForm.reset();
    window.card.deleteRenderedCard();
    window.pin.removePins();
    window.util.mapFilters.reset();
    window.pin.moveMainPinToCenter();
    window.form.desactivatePage();
    window.util.activePage = false;
  };

  // при неудачной отправке
  var onError = function () {
    showMessageError();
  };

  // удаление сообщения
  var deleteMessage = function () {
    if (success) {
      document.querySelector('.success').removeEventListener('click', onMessageClick);
      successMessage.remove();
      success = false;
    }
    if (error) {
      document.querySelector('.error').removeEventListener('click', onMessageClick);
      errorMessage.remove();
      error = false;
    }
    document.removeEventListener('keydown', onMessageEscPress);
  };

  // закрытие по клику
  var onMessageClick = function (evt) {
    evt.preventDefault();
    deleteMessage();
  };

  // закрытие по esc
  var onMessageEscPress = function (evt) {
    evt.preventDefault();
    if (evt.keyCode === window.util.ESC_KEYCODE) {
      deleteMessage();
    }
  };


  window.message = {
    'onSuccess': onSuccess,
    'onError': onError
  };
})();
