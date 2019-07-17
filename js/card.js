'use strict';

(function () {

  var TYPES_OF_HOUSING = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец'
  };
  var WIDTH_PHOTOS = 45;
  var HEIGHT_PHOTOS = 40;
  var map = document.querySelector('.map');

  // получение и удаление данных о одступных удобствах
  var getCardFeatures = function (cardArray) {
    var featuresList = document.querySelector('#card').content.querySelector('.popup__features');
    while (featuresList.firstChild) {
      featuresList.removeChild(featuresList.firstChild);
    }

    cardArray.offer.features.forEach(function (feature) {
      var featureItem = document.createElement('li');
      featureItem.classList.add('popup__feature', 'popup__feature--' + feature);
      featuresList.appendChild(featureItem);
    });
  };

  // получение и удаление фотографий
  var getCardPhotos = function (cardArray) {
    var cardPhotos = document.querySelector('#card').content.querySelector('.popup__photos');
    while (cardPhotos.firstChild) {
      cardPhotos.removeChild(cardPhotos.firstChild);
    }

    cardArray.offer.photos.forEach(function (photo) {
      var photoItem = document.createElement('img');
      photoItem.classList.add('popup__photo');
      photoItem.src = photo;
      photoItem.width = WIDTH_PHOTOS;
      photoItem.height = HEIGHT_PHOTOS;
      photoItem.alt = 'Фотография жилья';
      cardPhotos.appendChild(photoItem);
    });
  };

  //  создается карточка объявления
  var createCard = function (cardInfo) {
    var templateCard = document.querySelector('#card').content;
    var card = templateCard.cloneNode(true);
    card.querySelector('.popup__title').textContent = cardInfo.offer.title;
    card.querySelector('.popup__text--address').textContent = cardInfo.offer.address;
    card.querySelector('.popup__text--price').textContent = cardInfo.offer.price + ' ₽/ночь';
    card.querySelector('.popup__type').textContent = TYPES_OF_HOUSING[cardInfo.offer.type];
    card.querySelector('.popup__text--capacity').textContent = cardInfo.offer.rooms + ' комнаты для ' + cardInfo.offer.guests + ' гостей';
    card.querySelector('.popup__text--time').textContent = 'Заезд после ' + cardInfo.offer.checkin + ', выезд до ' + cardInfo.offer.checkout;
    card.querySelector('.popup__description').textContent = cardInfo.offer.description;
    card.querySelector('.popup__avatar').src = cardInfo.author.avatar;
    getCardFeatures(cardInfo);
    getCardPhotos(cardInfo);
    return card;
  };

  //  отрисовывается карточка
  var renderCard = function (cardInfo) {
    var fragment = document.createDocumentFragment();
    fragment.appendChild(createCard(cardInfo));
    map.appendChild(fragment);
  };

  // удаление карточки
  var deleteRenderedCard = function () {
    var renderedCard = map.querySelector('.map__card');
    if (renderedCard) {
      map.removeChild(renderedCard);
    }
  };

  // закртие карточки по нажатию на крестик
  var closeCardPopupOnButton = function (evt) {
    var closeButton = document.querySelector('.popup__close');
    if (evt.target === closeButton) {
      deleteRenderedCard();
    }
  };

  // закртие карточки по нажатию на esc
  var closeCardPopupOnEsc = function (evt) {
    if (evt.keyCode === window.pin.ESC_CODE) {
      deleteRenderedCard();
    }
  };

  // удаление и отрисовка новой карточки при нажатии на пины
  var changeCard = function (evt) {
    deleteRenderedCard();
    renderCard(evt);
  };

  document.addEventListener('keydown', closeCardPopupOnEsc);
  document.addEventListener('click', closeCardPopupOnButton);

  window.card = {
    'renderCard': renderCard,
    'changeCard': changeCard
  };

})();
