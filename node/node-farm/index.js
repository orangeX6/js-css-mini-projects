// Node Modules
const fs = require('fs');
const http = require('http');
const url = require('url');
// Our Modules
const replaceTemplate = require('./modules/replaceTemplate');
//Third Party Modules
const slugify = require('slugify');
const path = require('path');

// Fetching data from API
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

// Pushing slugs to the data object
dataObj.map(
  (el, index, dataObj) =>
    (dataObj[index].slug = slugify(el.productName, { lower: true }))
);

// Creating server
const server = http.createServer((req, res) => {
  const { query, pathname: pathName } = url.parse(req.url, true);

  // Overview Page
  if (pathName === '/' || pathName === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);
    res.end(output);

    //Product Page
  } else if (pathName.split('/').at(1) === 'product') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    // const product = dataObj[query.id];
    const product = dataObj.find((el) => el.slug === pathName.split('/').at(2));

    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    //API
  } else if (pathName === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);

    // Not Found
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'random-header': 'hello-world',
    }); // check network tab as u reload
    res.end('<h1>Page not found!</h1>');
  }
});
server.listen(8000, '127.0.0.1', () => {
  console.log('listening to request on port 8000');
});
