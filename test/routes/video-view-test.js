const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');

const app = require('../../app');
const Video = require('../../models/video');

const {parseTextFromHTML, buildVideoObject, seedVideoToDatabase} = require('../test-utils');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');

describe('Server path: /videos/:id', () => {
    const videoToCreate = buildVideoObject();
  
   beforeEach(connectDatabase);
  
   afterEach(disconnectDatabase);
  
   describe('GET', () => {
    it('renders the video', async () => {
      const video = await seedVideoToDatabase();

      const response = await request(app)
        .get(`/videos/${video._id}`);

      assert.include(parseTextFromHTML(response.text, 'body'), video.title);
      assert.include(parseTextFromHTML(response.text, 'body'), video.description);
    });
  });
});
