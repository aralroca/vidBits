const {assert} = require('chai');
const {createVideoViaDOM} = require('../test-utils');

describe('User deleting video', () => {
    describe('removes the Video from the list', () => {
      it('the video is saved successfully', () => {
        // Setup
        const {title, description, url} = createVideoViaDOM();
        
        // Exercise
        browser.click('#delete');
        
        // Verification
        assert.notInclude(browser.getText('body'), title);
        assert.notInclude(browser.getText('body'), description);
        assert.notInclude(browser.getText('body'), url);
      });  
    });
});
