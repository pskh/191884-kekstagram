'use strict';

var ESC_KEYCODE = 27;
var SCALE_STEP = 25;
var SCALE_MIN = 25;
var SCALE_MAX = 100;

var COMMENTS = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];

var DESCRIPTION = ['Тестим новую камеру!', 'Затусили с друзьями на море', 'Как же круто тут кормят', 'Отдыхаем...', 'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......', 'Вот это тачка!'];

var photoList = document.querySelector('.pictures');
var bigPhotoContainer = document.querySelector('.big-picture');
var photoComments = bigPhotoContainer.querySelector('.social__comments');
var bigPhotoClose = bigPhotoContainer.querySelector('.big-picture__cancel');
var buttonUploadPhoto = photoList.querySelector('#upload-file');
var editorPhoto = photoList.querySelector('.img-upload__overlay');
var editorEffect = editorPhoto.querySelector('.effects');
var editorPhotoClose = photoList.querySelector('.img-upload__cancel');
var scaleControlSmaller = editorPhoto.querySelector('.scale__control--smaller');
var scaleControlBigger = editorPhoto.querySelector('.scale__control--bigger');
var scaleControlValue = editorPhoto.querySelector('.scale__control--value');
var photoUploadPreview = editorPhoto.querySelector('.img-upload__preview');
var effectSlider = editorPhoto.querySelector('.img-upload__effect-level');
var effectLevelPin = editorPhoto.querySelector('.effect-level__pin');
var effectLevelValue = editorPhoto.querySelector('.effect-level__value');
var effectLevelLine = editorPhoto.querySelector('.effect-level__line');


var getRandomNumber = function (arr) {
  return Math.floor(Math.random() * arr.length);
};

var getRangeNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

var scalePhoto = function (step) {
  var scale = parseInt(scaleControlValue.value, 10) / 100 + step / 100;
  photoUploadPreview.style.transform = 'scale(' + scale + ')';
  scaleControlValue.value = (parseInt(scaleControlValue.value, 10) + step) + '%';
};

var getPhotos = function () {
  var photos = [];
  for (var i = 0; i < 25; i++) {
    var numberPhoto = i + 1;
    photos[i] = {
      url: 'photos/' + numberPhoto + '.jpg',
      likes: getRangeNumber(15, 199),
      comments: COMMENTS[getRandomNumber(COMMENTS)],
      description: DESCRIPTION[getRandomNumber(DESCRIPTION)]
    };
  }
  return photos;
};

var photoCollection = getPhotos();

var photoTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');

var renderPhoto = function (photo) {
  var photoElement = photoTemplate.cloneNode(true);

  photoElement.querySelector('.picture__img').src = photo.url;
  photoElement.querySelector('.picture__comments').textContent = photo.comments.length;
  photoElement.querySelector('.picture__likes').textContent = photo.likes;

  return photoElement;
};

var getFragment = function () {
  var fragment = document.createDocumentFragment();
  for (var j = 0; j < photoCollection.length; j++) {
    fragment.appendChild(renderPhoto(photoCollection[j]));
  }
  return fragment;
};

var getBigPhoto = function (photoContainer, photoElement) {
  for (var i = 0; i < photoCollection.length; i++) {
    photoContainer.querySelector('.social__caption')
        .textContent = photoElement[i].description;

    photoContainer.querySelector('.likes-count')
        .textContent = photoElement[i].likes;

    photoContainer.querySelector('.comments-count')
        .textContent = photoElement[i].comments.length;
  }
};

var renderComment = function () {
  var commentElement = bigPhotoContainer.querySelector('.social__comment').cloneNode(true);

  commentElement.querySelector('.social__picture').src = 'img/avatar-' + getRangeNumber(1, 6) + '.svg';

  for (var i = 0; i < photoCollection.length; i++) {
    commentElement.querySelector('.social__text').textContent = photoCollection[i].comments;
  }

  return commentElement;
};

photoComments.appendChild(renderComment());

photoList.appendChild(getFragment());

var miniaturePhoto = photoList.querySelectorAll('.picture');

var onMiniaturePhotoClick = function (photo, miniature) {
  miniature.addEventListener('click', function () {
    bigPhotoContainer.classList.remove('hidden');
    bigPhotoContainer.querySelector('.big-picture__img')
        .querySelector('img')
        .src = photo.url;

    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === ESC_KEYCODE) {
        bigPhotoContainer.classList.add('hidden');
      }
    });
  });
};

var findUrlBigPhoto = function () {
  for (var i = 0; i < photoCollection.length; i++) {
    onMiniaturePhotoClick(photoCollection[i], miniaturePhoto[i]);
  }
};

findUrlBigPhoto();

getBigPhoto(bigPhotoContainer, photoCollection);

bigPhotoContainer.querySelector('.social__comment-count').classList.add('visually-hidden');
bigPhotoContainer.querySelector('.comments-loader').classList.add('visually-hidden');

bigPhotoClose.addEventListener('click', function () {
  bigPhotoContainer.classList.add('hidden');
});

buttonUploadPhoto.addEventListener('change', function () {
  editorPhoto.classList.remove('hidden');

  document.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      editorPhoto.classList.add('hidden');
      buttonUploadPhoto.value = '';
    }
  });
});

editorPhotoClose.addEventListener('click', function () {
  editorPhoto.classList.add('hidden');
  buttonUploadPhoto.value = '';
});

scaleControlSmaller.addEventListener('click', function () {
  if (parseInt(scaleControlValue.value, 10) > SCALE_MIN) {
    scalePhoto(-SCALE_STEP);
  }
});

scaleControlBigger.addEventListener('click', function () {
  if (parseInt(scaleControlValue.value, 10) < SCALE_MAX) {
    scalePhoto(SCALE_STEP);
  }
});

effectSlider.classList.add('hidden');

var addPhotoEffect = function (effect) {
  var nameEffect = effect.replace('effect-', '');
  photoUploadPreview.querySelector('img').className = 'effects__preview--' + nameEffect + '';
  photoUploadPreview.style.filter = '';
  if (effect !== 'effect-none') {
    effectSlider.classList.remove('hidden');
  } else {
    effectSlider.classList.add('hidden');
  }
};

var changeFilter = function (filter) {
  var pinPosition = parseInt(window.getComputedStyle(effectLevelPin).left, 10);
  var blockWidth = parseInt(window.getComputedStyle(effectLevelLine).width, 10);
  var proportionValue =  (pinPosition / blockWidth).toFixed(2);
  var nameFilter = filter.replace('effects__preview--', '');

  switch (nameFilter) {
    case 'chrome':
      photoUploadPreview.style.filter = 'grayscale(' + proportionValue + ')';
      break;
    case 'sepia':
      photoUploadPreview.style.filter = 'sepia(' + proportionValue + ')';
      break;
    case 'marvin':
      photoUploadPreview.style.filter = 'invert(' + (proportionValue * 100 + '%') + ')';
      break;
    case 'phobos':
      photoUploadPreview.style.filter = 'blur(' + (proportionValue * 3 + 'px') + ')';
      break;
    case 'heat':
      photoUploadPreview.style.filter = 'brightness(' + (proportionValue * 2 + 1) + ')';
      break;
  };
  effectLevelValue.value = parseFloat(photoUploadPreview.style.filter.match(/(\d[\d\.]*)/));
};

editorEffect.addEventListener('click', function (evt) {
  if (evt.target.getAttribute('name', 'effect')) {
    var radioId = evt.target.id;

    addPhotoEffect(radioId);
  }
}, true);

effectLevelPin.addEventListener('mouseup', function () {
  var nameFilter = photoUploadPreview.querySelector('img').className;

  changeFilter(nameFilter);
});
