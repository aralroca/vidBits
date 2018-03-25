const {assert} = require('chai');
const {createVideoViaDOM} = require('../test-utils');

describe('User visits landing page', () => {
    describe('without existing items', () => {
        it('starts blank', () => {
            browser.url('/videos');
            assert.equal(browser.getText('#videos-container'), '');
        });
    });
    describe('with an existing video', () => {
        it('title and iframe with a video’s URL are rendered', () => {
            const {title, description, url} = createVideoViaDOM();

            browser.url('/videos');

            assert.include(browser.getText('#videos-container'), title);
            assert.include(browser.getAttribute('.video-player', 'src'), url);
        });
        it('can navigate to a video', () => {
            const {title, description, url} = createVideoViaDOM();

            browser.url('/videos');
            browser.click('.video-title a');
            
            assert.include(browser.getText('#videos-container'), title);
            assert.include(browser.getText('#videos-container'), description);
            assert.include(browser.getAttribute('.video-player', 'src'), url);
        });
    });
    describe('Click on a link to navigate', () => {
        it('to create video from landing page', () => {
            browser.url('/videos');
            browser.click('a[href="videos/new"]');
            assert.include(browser.getText('body'), 'Save a video');
        });
        it('to edit some video page', () => {
            createVideoViaDOM();

            browser.url('/videos');
            browser.click('.video-title a');
            browser.click('#edit-button')
            
            assert.include(browser.getText('#videos-container'), 'Edit video');
        });
    });
});
