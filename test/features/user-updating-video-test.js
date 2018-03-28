const {assert} = require('chai');
const {createVideoViaDOM} = require('../test-utils');

describe('User visits edit page', () => {
    describe('modify the video data', () => {
      it('the video is saved successfully', () => {
        // Setup
        const {title, description, url} = createVideoViaDOM();
        const newTitle = 'New title';
        const newDescription = 'New description';
        const newUrl = 'https://youtube.com/test';
  
        // Exercice
        browser.click('#edit-button');
        browser.setValue('#title-input', newTitle);
        browser.setValue('#description-input', newDescription);
        browser.setValue('#url-input', newUrl);
        browser.click('#submit-button');
  
        // Verification
        assert.include(browser.getText('body'), newTitle);
        assert.notInclude(browser.getText('body'), title);
        assert.include(browser.getText('body'), newDescription);
        assert.notInclude(browser.getText('body'), description);
        assert.include(browser.getAttribute('body iframe', 'src'), newUrl);
        assert.notInclude(browser.getAttribute('body iframe', 'src'), url);
      });
    });
  });
