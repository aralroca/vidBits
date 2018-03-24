const {jsdom} = require('jsdom');

const Item = require('../models/video');

// Create and return a sample Item object
const buildItemObject = (options = {}) => {
  const title = options.title || 'The Jazz hop caffe';
  const videoUrl = options.imageUrl || 'https://www.youtube.com/watch?v=kPChs1S6s1E';
  const description = options.description || 'Video music for relaxing';
  return {title, videoUrl, description};
};

// Add a sample Item object to mongodb
const seedItemToDatabase = async (options = {}) => {
  const item = await Item.create(buildItemObject(options));
  return item;
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
  buildItemObject,
  seedItemToDatabase,
  parseTextFromHTML,
  parseAttributeFromHTML,
};