const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');

const app = require('../../app');
const Video = require('../../models/video');

const {parseTextFromHTML, buildItemObject} = require('../test-utils');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');

describe('Server path: /videos', () => {
    const videoToCreate = buildItemObject();
  
   beforeEach(connectDatabase);
  
   afterEach(disconnectDatabase);
  
    describe('GET', () => {
      it('', () => {

      });
    });
  
    describe('POST', ()=> {
      it('get status 201 after creation', async ()=> {
        const response = await request(app)
          .post('/videos')
          .type('form')
          .send(videoToCreate);
        
        assert.equal(response.status, 201);
      });

      it('submits a video with a title and description', async () => {
        const response = await request(app)
            .post('/videos')
            .type('form')
            .send(videoToCreate);
        const video = await Video.findOne({});

        assert.strictEqual(video.title, videoToCreate.title);
        assert.strictEqual(video.description, videoToCreate.description);
      });
    });
});
