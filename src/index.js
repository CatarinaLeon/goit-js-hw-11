import './sass/main.scss';
// import axios from "axios";
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const buttonLoad = document.querySelector('.load-more');


const KEY = '24464531-810b90441dc32988cf7404dfc';
const BASE_URL = 'https://pixabay.com/api';

searchForm.addEventListener('submit', onSearch);
buttonLoad.addEventListener('click', buttonClick);

let page = 1;
buttonLoad.classList.add('is-hidden');

async function fetchImages (value) {
  const response = await fetch(
    `${BASE_URL}/?key=${KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
  );
  page += 1;
  return response.json();
  
};

// function fetchImages(value) {
//   return fetch(`${BASE_URL}/?key=${KEY}&q=${value}&image_type=photo&pretty=true`).then(res=> {
//     return res.json();
// }).then(res=>res)
// }

async function onSearch (e) {
  e.preventDefault();
  clearLightbox();
  const value = searchForm.elements.searchQuery.value;
  if (!value.trim()) {
    buttonLoad.classList.add('is-hidden');
    Notiflix.Notify.info('Please, write something');
    return;
  }
  
  // console.log(value);
  const { totalHits } = await fetchImages(value)
  
    if (!totalHits) {
    buttonLoad.classList.add('is-hidden');
    return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
  }
  page = 1
  fetchImages(value).then(renderPhoto).catch(error => error);
}

function renderPhoto({ hits, totalHits }) {
  // console.log(hits);
  const pageLimit = Math.ceil(totalHits / hits.length);
    const markup = hits.map(({
        webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
      return `<a class="gallery__item" href="${largeImageURL}"><div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${downloads}</b>
    </p>
  </div>
</div></a>`
    }).join('');
  // console.log(markup);
  gallery.insertAdjacentHTML('beforeend', markup);

  buttonLoad.classList.remove('is-hidden');
  if (page === pageLimit) {
    setTimeout(() => {
      Notiflix.Notify.failure(`We're sorry, but you've reached the end of search results.`);
      buttonLoad.classList.add('is-hidden');
    }, 0);
  }
  lightLiteBox = new SimpleLightbox('.gallery a', {
        /* options */
        captionsData: 'alt',
        captionDelay: 250,
  });
  lightbox.refresh();
}
// console.log(gallery);

function buttonClick(e) {
  const value = searchForm.elements.searchQuery.value;
  fetchImages(value).then(renderPhoto).catch(error => error);
}

function clearLightbox() {
  gallery.innerHTML = '';
}
