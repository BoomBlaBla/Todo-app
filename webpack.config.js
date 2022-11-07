import {precacheAndRoute} from 'workbox-precaching';
precacheAndRoute([
  {url: '/index.html', revision: '383676' },
  {url: '/css/*', revision: null},
  {url: '/js/*', revision: null},
  {url: '/media/*', revision: null},
  // ... other entries ...
]);


const {GenerateSW} = require('workbox-webpack-plugin');

module.exports = {
  // Other webpack config...
  plugins: [
    // Other plugins...
    new GenerateSW()
  ]
};