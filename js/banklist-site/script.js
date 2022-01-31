'use strict';

//*Selecting Elements
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnOpenModal = document.querySelectorAll('.btn--show-modal');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const allSections = document.querySelectorAll('.section');
const header = document.querySelector('.header');
const section1 = document.getElementById('section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

///////////////////////////////////////

//*Modal Window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

////////////////////////////////////////////////
////////////////////////////////////////////////

//* BUTTON SCROLLING
//? 188. IMPLEMENTING SMOOTH SCROLLING
btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

//////////////////////////////////////////////
//////////////////////////////////////////////
//*PAGE NAVIGATION
//? 192. EVENT DELEGATION: IMPLEMENTING PAGE NAVIGATION

document.querySelector('.nav__links ').addEventListener('click', function (e) {
  e.preventDefault();

  //Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////

//* TABBED CONTAINER
//? 194. BUILDING A TABBED COMPONENT

tabsContainer.addEventListener('click', function (e) {
  // e.preventDefault();
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;

  //Active Tab
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  //Remove Active class
  tabsContent.forEach(tc => tc.classList.remove('operations__content--active'));

  //Activate Content Area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////

//* MENU FADING ANIMATION
//Handle mouseover and mouseout
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

//Passing parameter
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

/////////////////////////////////////////////////
/////////////////////////////////////////////////

//* STICKY NAVIGATION
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

/////////////////////////////////////////////////
/////////////////////////////////////////////////

//* REVEAL SECTIONS
//? 198. REVEALING ELEMENTS ON SCROLL

const revealSection = function (entries, observer) {
  const [entry] = entries;
  //Guard Clause
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////

//* LAZY LOADING IMAGES
//? 199. LAZY LOADING IMAGES
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  //Guard Clause
  if (!entry.isIntersecting) return;

  //Replace src attribute with data-src
  entry.target.src = entry.target.dataset.src;

  //Removing the blur class
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imageObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '300px',
});

imgTargets.forEach(img => imageObserver.observe(img));

/////////////////////////////////////////////////
/////////////////////////////////////////////////

//* SLIDER (Carousel)
//? 200. BUILDING A SLIDER COMPONENT: PART 1
//SLIDER FUNCTION -------------------------
const slider = function () {
  ////////////////////////!
  //*SLIDER VARIABLES
  let curSlide = 0;
  const maxSlide = slides.length - 1;

  ////////////////////!
  //*FUNCTIONS
  //Create Dot
  const createDots = function () {
    slides.forEach(function (_, i) {
      const dots = `
    <button class = "dots__dot" data-slide ="${i}"></button>
    `;
      dotContainer.insertAdjacentHTML('beforeend', dots);
    });
  };

  //Activate Dot
  const activateDot = function (slide = 0) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"`)
      .classList.add('dots__dot--active');
  };

  //SLider
  const goToSlide = function (slide = 0) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  //Next Slide
  const nextSlide = function () {
    if (curSlide === maxSlide) curSlide = 0;
    else curSlide++;
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  //Prev Slide
  const prevSlide = function () {
    if (curSlide === 0) curSlide = maxSlide;
    else curSlide--;
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  //////////////////////!
  //*INITIALIZE
  const init = function () {
    //0%, 100%, 200%, 300%
    goToSlide();
    createDots();
    activateDot();
  };
  init();

  ////////////////////!
  //* EVENT HANDLERS
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  //* Using keyboard event to slide with left and right keys
  document.addEventListener('keydown', function (e) {
    console.log(e);
    if (e.key === 'ArrowLeft') prevSlide();
    //Short Circuit method
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      //using object destructuring
      const { slide } = e.target.dataset;
      curSlide = Number(slide);
      goToSlide(slide);
      activateDot(slide);
    }
  });
};

slider();
