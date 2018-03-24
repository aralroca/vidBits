const {assert} = require('chai');
const {buildItemObject} = require('../test-utils');

describe('User visits create page', () => {
    describe('posts a new video', () => {
        it('is possible to fill title and description', () => {
          const {title, description} = buildItemObject();
          browser.url('videos/create.html');
    
          browser.setValue('#title-input', title);
          browser.setValue('#description-input', description);
          browser.click('#submit-button');
    
          assert.include(browser.getText('body'), title);
          assert.include(browser.getText('body'), description);
        });
      });

    describe('navigate to landing page', () => {
        it('click on logo', () => {
            browser.url('videos/create.html');
            browser.click('a[href="/index.html"]');
            assert.include(browser.getUrl(), 'index.html');
        });
    });
});
