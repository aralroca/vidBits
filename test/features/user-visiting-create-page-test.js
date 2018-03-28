const {assert} = require('chai');
const {buildVideoObject} = require('../test-utils');

describe('User visits create page', () => {
    describe('posts a new video', () => {
        it('is possible to create a new video', () => {
          // Setup
          const {title, description, url} = buildVideoObject();
          browser.url('/videos/new');
          
          // Exercise
          browser.setValue('#url-input', url);
          browser.setValue('#title-input', title);
          browser.setValue('#description-input', description);
          browser.click('#submit-button');
          
          // Verification
          assert.include(browser.getAttribute('iframe', 'src'), url);
          assert.include(browser.getText('body'), title);
        });

        it('title input should have a maxlength of 50', () => {
            const maxlength = 50;
            browser.url('/videos/new');
            assert.equal(
              browser.getAttribute('#title-input', 'maxlength'),
              maxlength
            );
          });
    });
});
