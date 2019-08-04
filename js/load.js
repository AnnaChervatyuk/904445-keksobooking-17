'use strict';

(function () {
  var URL = 'https://js.dump.academy/keksobooking/data';
  var URL_SAVE = 'https://js.dump.academy/keksobooking';
  var TIMEOUT = 1000;
  var METHOD_GET = 'GET';
  var METHOD_POST = 'POST';

  function createXhr(method, url, onSuccess, onError, data) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onSuccess(xhr.response);
      } else {
        onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT;

    xhr.open(method, url);

    if (method === METHOD_GET) {
      xhr.send();
    } else {
      xhr.send(data);
    }
  }

  function load(onSuccess, onError) {
    createXhr(METHOD_GET, URL, onSuccess, onError);
  }

  function save(data, onSuccess, onError) {
    createXhr(METHOD_POST, URL_SAVE, onSuccess, onError, data);
  }

  window.load = {
    load: load,
    save: save
  };

})();
