const {assert} = require('chai');

describe('User visits landing page', () => {
    describe('without existing items', () => {
        it('starts blank', () => {
            browser.url('/');
            assert.equal(browser.getText('#videos-container'), '');
        });
    });
    describe('Click on a link to navigate', () => {
        it('to create video from landing page', () => {
            browser.url('/');
            browser.click('a[href="videos/new"]');
            assert.include(browser.getText('body'), 'Save a video');
        });
    });
});
