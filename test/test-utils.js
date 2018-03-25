const {jsdom} = require('jsdom');

const Video = require('../models/video');

// Create and return a sample Video object
const buildVideoObject = (options = {}) => {
  const title = options.title || 'The Jazz hop caffe';
  const url = options.url || generateRandomUrl('www.youtube.com');
  const description = options.description || 'Video music for relaxing';
  return {title, description, url};
};

// Create video interacting with DOM
const createVideoViaDOM = () => {
  const {title, description, url} = buildVideoObject();

  browser.url('/videos/new');
  browser.setValue('#url-input', url);
  browser.setValue('#title-input', title);
  browser.setValue('#description-input', description);
  browser.click('#submit-button');

  return {title, description, url};
}

const generateRandomUrl = (domain) => {
  return `http://${domain}/${Math.random()}`;
};

// Add a sample Video object to mongodb
const seedVideoToDatabase = async (options = {}) => {
  const video = await Video.create(buildVideoObject(options));
  return video;
};

// extract text from an Element by selector.
const parseTextFromHTML = (htmlAsString, selector) => {
  const selectedElement = jsdom(htmlAsString).querySelector(selector);
  if (selectedElement !== null) {
    return selectedElement.textContent;
  } else {
    throw new Error(`No element with selector ${selector} found in HTML string`);
  }
};

// extract attribute from an Element by selector.
const parseAttributeFromHTML = attribute => (htmlAsString, selector) => {
  const selectedElement = jsdom(htmlAsString).querySelector(selector);
  if (selectedElement !== null) {
    return selectedElement[attribute];
  } else {
    throw new Error(`No element with selector ${selector} found in HTML string`);
  }
};

module.exports = {
  buildVideoObject,
  createVideoViaDOM,
  generateRandomUrl,
  parseAttributeFromHTML,
  parseTextFromHTML,
  seedVideoToDatabase,
};
