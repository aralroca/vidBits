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
            // Setup
            const {title, description, url} = createVideoViaDOM();

            // Exercise
            browser.url('/videos');

            // Verification
            assert.include(browser.getText('#videos-container'), title);
            assert.include(browser.getAttribute('.video-player', 'src'), url);
        });
        it('can navigate to a video', () => {
            // Setup
            const {title, description, url} = createVideoViaDOM();

            // Exercise
            browser.url('/videos');
            browser.click('.video-title a');
            
            // Verification
            assert.include(browser.getText('#videos-container'), title);
            assert.include(browser.getText('#videos-container'), description);
            assert.include(browser.getAttribute('.video-player', 'src'), url);
        });
    });
    describe('Click on a link to navigate', () => {
        it('to create video from landing page', () => {
            // Setup
            browser.url('/videos');

            // Exercise
            browser.click('a[href="videos/new"]');

            // Verification
            assert.include(browser.getText('body'), 'Save a video');
        });
        it('to edit some video page', () => {
            // Setup
            createVideoViaDOM();
            
            // Exercise
            browser.url('/videos');
            browser.click('.video-title a');
            browser.click('#edit-button')
            
            // Verification
            assert.include(browser.getText('#videos-container'), 'Edit video');
        });
    });
});
