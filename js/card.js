'use strict';

(function () {

  var WIDTH_PHOTOS = 45;
  var HEIGHT_PHOTOS = 40;
  var changeTypeFLatToRu = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец'
  };

  //  создается карточка объявления
  var createCard = function (cardInfo) {
    var templateCard = document.querySelector('#card').content;
    var card = templateCard.cloneNode(true);
    var cardFeaturesList = card.querySelector('.popup__features');
    var cardPhotosList = card.querySelector('.popup__photos');
    card.querySelector('.popup__title').textContent = cardInfo.offer.title;
    card.querySelector('.popup__text--address').textContent = cardInfo.offer.address;
    card.querySelector('.popup__text--price').textContent = cardInfo.offer.price + ' ₽/ночь';
    card.querySelector('.popup__type').textContent = changeTypeFLatToRu[cardInfo.offer.type];
    card.querySelector('.popup__text--capacity').textContent = cardInfo.offer.rooms + ' комнаты для ' + cardInfo.offer.guests + ' гостей';
    card.querySelector('.popup__text--time').textContent = 'Заезд после ' + cardInfo.offer.checkin + ', выезд до ' + cardInfo.offer.checkout;
    card.querySelector('.popup__description').textContent = cardInfo.offer.description;
    card.querySelector('.popup__avatar').src = cardInfo.author.avatar;
    cardFeaturesList.innerHTML = '';
    cardPhotosList.innerHTML = '';

    // проверка на наличие и добавление удобств
    if (cardInfo.offer.features.length !== 0) {
      cardInfo.offer.features.forEach(function (feature) {
        var featureItem = document.createElement('li');
        featureItem.className = 'popup__feature popup__feature--' + feature;
        cardFeaturesList.appendChild(featureItem);
      });
    } else {
      cardFeaturesList.classList.add('visually-hidden');
    }

    // проверка на наличие и добавление фото
    if (cardInfo.offer.photos.length !== 0) {
      cardInfo.offer.photos.forEach(function (photo) {
        var photoItem = document.createElement('img');
        photoItem.classList.add('popup__photo');
        photoItem.src = photo;
        photoItem.width = WIDTH_PHOTOS;
        photoItem.height = HEIGHT_PHOTOS;
        photoItem.alt = 'Фотография жилья';
        cardPhotosList.appendChild(photoItem);
      });
    } else {
      cardPhotosList.classList.add('visually-hidden');
    }
    return card;
  };

  //  отрисовывается карточка
  var renderCard = function (cardInfo) {
    if (cardInfo.offer) {
      var fragment = document.createDocumentFragment();
      fragment.appendChild(createCard(cardInfo));
      window.util.map.appendChild(fragment);
      document.addEventListener('keydown', closeCardPopupOnEsc);
      document.addEventListener('click', closeCardPopupOnButton);
    }
  };

  // удаление карточки
  var deleteRenderedCard = function () {
    var renderedCard = window.util.map.querySelector('.map__card');
    if (renderedCard) {
      window.util.map.removeChild(renderedCard);
      window.util.map.querySelector('.map__pin--active').classList.remove('map__pin--active');
    }
    document.removeEventListener('click', closeCardPopupOnButton);
    document.removeEventListener('keydown', closeCardPopupOnEsc);
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
    if (evt.keyCode === window.util.ESC_KEYCODE) {
      deleteRenderedCard();

    }
  };

  // удаление и отрисовка новой карточки при нажатии на пины
  var changeCard = function (evt) {
    deleteRenderedCard();
    renderCard(evt);
  };

  window.card = {
    renderCard: renderCard,
    deleteRenderedCard: deleteRenderedCard,
    changeCard: changeCard
  };

})();
