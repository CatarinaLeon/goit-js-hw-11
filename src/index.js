import './sass/main.scss';
// import axios from "axios";
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const searchForm = document.querySelector('.header-form');
const gallery = document.querySelector('.gallery');
const buttonLoad = document.querySelector('.load-more');
const mainImgSearch = document.querySelector('.main-gif');


const KEY = '24464531-810b90441dc32988cf7404dfc';
const BASE_URL = 'https://pixabay.com/api';

searchForm.addEventListener('submit', onSearch);
buttonLoad.addEventListener('click', buttonClick);
buttonLoad.classList.add('is-hidden');


let page = 1;
let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});


async function fetchImages (value) {
  const response = await fetch(
    `${BASE_URL}/?key=${KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
  );
  // page += 1;
  return response.json();
};

async function onSearch (e) {
  e.preventDefault();

  const value = searchForm.elements.searchQuery.value;

  if (!value.trim()) {
    mainImgSearch.classList.remove('is-hidden'); // показати заставку
    Notiflix.Notify.info('Please, write something');
    clearLightbox() // очистити картинки (галерею)
    buttonLoad.classList.add('is-hidden'); // сховати кнопку
    return;
  }
  
  clearLightbox();
  mainImgSearch.classList.add('is-hidden');
  page = 1

  try {
    const data = await fetchImages(value)
    if (!data.totalHits) {
    mainImgSearch.classList.remove('is-hidden'); // показати заставку
      buttonLoad.classList.add('is-hidden');
      return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
    }

    renderPhoto(data);
  } catch (error) {
    console.error(error);
    Notiflix.Notify.failure('Something went wrong');
  }
}


function renderPhoto({ hits, totalHits }) {
  const PER_PAGE = 40;
  const pageLimit = Math.ceil(totalHits / PER_PAGE);

  const markup = hits.map(({
      webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
    return `<a class="gallery__item" href="${largeImageURL}"><div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
</div></a>`
    }).join('');
  gallery.insertAdjacentHTML('beforeend', markup);

  buttonLoad.classList.remove('is-hidden');

  if (page === pageLimit) {
    setTimeout(() => {
      Notiflix.Notify.failure(`We're sorry, but you've reached the end of search results.`);
      buttonLoad.classList.add('is-hidden');
    }, 0);
  }
  lightbox.refresh();
}

function buttonClick(e) {
  page += 1;
  const value = searchForm.elements.searchQuery.value;
  fetchImages(value).then(renderPhoto).catch(error => {
  console.error(error);
  Notiflix.Notify.failure('Something went wrong');
});
}

function clearLightbox() {
  gallery.innerHTML = '';
  page = 1;
}


// зміна поточного року в футер
const currentYear = new Date().getFullYear();
const copyrightElement = document.getElementById('copyright');
copyrightElement.textContent = `©${currentYear} All rights reserved.`;