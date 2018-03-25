const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');

const app = require('../../app');
const Video = require('../../models/video');

const {parseTextFromHTML, buildVideoObject, seedVideoToDatabase} = require('../test-utils');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');

describe('Server path: /videos', () => {
    const videoToCreate = buildVideoObject();
  
   beforeEach(connectDatabase);
  
   afterEach(disconnectDatabase);
  
   describe('GET', () => {
    it('renders all videos from the database', async () => {
      const firstVideo = await seedVideoToDatabase({title: 'Video1'});
      const secondVideo = await seedVideoToDatabase({title: 'Video2'});

      const response = await request(app)
        .get('/videos');

      assert.include(parseTextFromHTML(response.text, '#videos-container'), firstVideo.title);
      assert.include(parseTextFromHTML(response.text, '#videos-container'), secondVideo.title);
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

      it('not save the video if title is missed', async () => {
        const newVideo = Object.assign({}, videoToCreate, { title: undefined });
        const response = await request(app)
            .post('/videos')
            .type('form')
            .send(newVideo);
        const video = await Video.findOne({});

        assert.isNull(video);
      });

      it('return status 400 if title is missed', async () => {
        const newVideo = Object.assign({}, videoToCreate, { title: undefined });;
        const response = await request(app)
            .post('/videos')
            .type('form')
            .send(newVideo);

        assert.equal(response.status, 400);
      });
    });

    it('renders the video form with other fields if title is missed', async () => {
      const newVideo = Object.assign({}, videoToCreate, { title: undefined });;
      const response = await request(app)
          .post('/videos')
          .type('form')
          .send(newVideo);
      const video = await Video.findOne({});

      assert.include(parseTextFromHTML(response.text, '.input-form'), newVideo.description);
    });

    it('request with no title should display an error message', async () => {      
      const newVideo = Object.assign({}, videoToCreate, { title: undefined });;
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(newVideo);
      
      assert.include(parseTextFromHTML(response.text, 'form'), 'Title is required');
    });
});
