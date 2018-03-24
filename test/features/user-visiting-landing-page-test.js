const {assert} = require('chai');

describe('User visits landing page', () => {
    describe('without existing items', () => {
        it('starts blank', () => {
            browser.url('/');
            assert.equal(browser.getText('#videos-container'), '');
        });
    });
    describe('Click on a link to navigate', () => {
        it('to create.html from landing page', () => {
            browser.url('/');
            browser.click('a[href="videos/create.html"]');
            assert.include(browser.getText('body'), 'Save a video');
        });
    });
});
