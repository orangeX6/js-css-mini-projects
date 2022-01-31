'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderCountry = function (data, className = '') {
  const language = Object.values(data.languages)[0];
  const [currency] = Object.values(Object.values(data.currencies)[0]);

  const html = `
  <article class="country ${className}">
  <img class="country__img" src="${data.flags.svg}" />
  <div class="country__data">
      <h3 class="country__name">${data.name.common} </h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
        +data.population / 1000000
      ).toFixed(1)}M people </p>
      <p class="country__row"><span>🗣️</span>${language}</p>
      <p class="country__row"><span>💰</span>${currency}</p>
  </div>
  </article>
`;

  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  countriesContainer.style.opacity = 1;
};

const getJSON = function (url, errorMsg = 'Something went wrong') {
  return fetch(url).then(response => {
    ////Error message
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);

    return response.json();
  });
};

////Promisifying GeoLocation
const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const whereAmI = async function () {
  try {
    ////GeoLocation
    const pos = await getPosition();
    const { latitude: lat, longitude: lng } = pos.coords;

    ////Reverse GeoCoding
    const resGeo = await fetch(
      `https://geocode.xyz/${lat},${lng}?geoit=json&auth=203587146895865211996x1290`
    );
    if (!resGeo.ok) throw new Error('Problem getting location data');

    const dataGeo = await resGeo.json();
    console.log(dataGeo);

    ////RestCountries - Country data
    const res = await fetch(
      `https://restcountries.com/v3.1/name/${dataGeo.country}?fullText=true`
    );
    if (!res.ok) throw new Error('Problem getting country');

    const data = await res.json();
    console.log(data);
    renderCountry(data[0]);
    const neighbor = data[0].borders[0];
    console.log(neighbor);
    if (!neighbor) return `You are in ${dataGeo.city}, ${dataGeo.country}`;

    //Country 2
    const resN = await fetch(
      `https://restcountries.com/v3.1/alpha/${neighbor}`
    );
    if (!resN.ok) throw new Error('Problem getting country');
    const dataN = await resN.json();
    renderCountry(dataN[0], 'neighbor');

    return `You are in ${dataGeo.city}, ${dataGeo.country}`;
  } catch (err) {
    console.error(`CUSTOM MESSAGE ${err}`);
    renderError(`💥 ${err.message} `);

    //// Reject promise returned from async function
    throw err;
  }
};

//>> USING iify here (Immediately invoked func)
console.log('1: Will get location');
(async function () {
  try {
    const city = await whereAmI();
    console.log(`2: ${city}`);
  } catch (err) {
    console.error(`2: ${err.message} 💥`);
  }
  ////finally (Executed no matter what)
  console.log('3: Finished Getting Location.');
})();

/*

const getCountryData = function (country) {
  ////Country 1
  getJSON(
    `https://restcountries.com/v3.1/name/${country}?fullText=true`,
    'Country Not Found'
  )
    .then(data => {
      console.log(data[0]);
      renderCountry(data[0]);
      if (!data[0].borders) throw new Error('No neighbor found!');
      const neighbor = data[0].borders[0];
      ////Country 2
      return getJSON(
        `https://restcountries.com/v3.1/alpha/${neighbor}`,
        'Country Not Found'
      );
    })
    .then(data => renderCountry(data[0], 'neighbor'))
    .catch(err => {
      console.error(`${err} 💥💥💥`);
      renderError(`Something went wrong! 💥💥💥 ${err.message}`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

btn.addEventListener('click', function () {
  getCountryData('India');
  // getCountryData('canada');
});

// getCountryData('australia');

*/
