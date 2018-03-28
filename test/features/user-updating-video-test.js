const {assert} = require('chai');
const {buildVideoObject} = require('../test-utils');

describe('User visits edit page', () => {
    describe('modify the video data', () => {
      it('the video is saved successfully', () => {
        const {title, description, url} = buildVideoObject();
        const newTitle = 'New title';
        const newDescription = 'New description';
        const newUrl = 'https://youtube.com/test';
        browser.url('/videos');
  
        browser.click('#add-video-button');
        browser.setValue('#title-input', title);
        browser.setValue('#description-input', description);
        browser.setValue('#url-input', url);
        browser.click('#submit-button');
  
        browser.click('#edit-button');
        browser.setValue('#title-input', newTitle);
        browser.setValue('#description-input', newDescription);
        browser.setValue('#url-input', newUrl);
        browser.click('#submit-button');
  
        // New title
        assert.include(browser.getText('body'), newTitle);
        assert.notInclude(browser.getText('body'), title);

        // New description
        assert.include(browser.getText('body'), newDescription);
        assert.notInclude(browser.getText('body'), description);

        // New url
        assert.include(browser.getAttribute('body iframe', 'src'), newUrl);
        assert.notInclude(browser.getAttribute('body iframe', 'src'), url);
      });
    });
  });
