const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');

const app = require('../../app');
const Video = require('../../models/video');

const {
  parseTextFromHTML, parseAttributeFromHTML, buildVideoObject, 
  seedVideoToDatabase
} = require('../test-utils');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');

const getValue = parseAttributeFromHTML('value');

describe('Server path: /videos', () => {
   const videoToCreate = buildVideoObject();
  
   beforeEach(connectDatabase);
  
   afterEach(disconnectDatabase);
  
   describe('GET', () => {
    it('renders all videos from the database', async () => {
      // Setup
      const firstVideo = await seedVideoToDatabase({title: 'Video1'});
      const secondVideo = await seedVideoToDatabase({title: 'Video2'});

      // Exercise
      const response = await request(app)
        .get('/videos');

      // Verification
      assert.include(parseTextFromHTML(response.text, '#videos-container'), firstVideo.title);
      assert.include(parseTextFromHTML(response.text, '#videos-container'), secondVideo.title);
    });
  });
  
    describe('POST', ()=> {
      it('redirect to the view page after the creation', async () => {
        const response = await request(app)
            .post('/videos')
            .type('form')
            .send(videoToCreate);

        const video = await Video.findOne({});

        assert.equal(response.status, 302);
        assert.equal(response.headers.location, `/videos/${video._id}`);
      });

      it('submits a video with a title, description and url', async () => {
        const response = await request(app)
            .post('/videos')
            .type('form')
            .send(videoToCreate);
        const video = await Video.findOne({});

        assert.strictEqual(video.title, videoToCreate.title);
        assert.strictEqual(video.description, videoToCreate.description);
        assert.strictEqual(video.url, videoToCreate.url);
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

      assert.include(parseTextFromHTML(response.text, '#description-input'), newVideo.description);
      assert.include(getValue(response.text, '#url-input'), newVideo.url);
    });

    it('request without title should display an error message', async () => {      
      const newVideo = Object.assign({}, videoToCreate, { title: undefined });;
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(newVideo);
      
      assert.include(parseTextFromHTML(response.text, 'form'), 'Title is required');
    });

    it('renders the video form with other fields if description is missed', async () => {
      const newVideo = Object.assign({}, videoToCreate, { description: undefined });;
      const response = await request(app)
          .post('/videos')
          .type('form')
          .send(newVideo);
      const video = await Video.findOne({});

      assert.include(getValue(response.text, '#title-input'), newVideo.title);
      assert.include(getValue(response.text, '#url-input'), newVideo.url);
    });

    it('request without description should display an error message', async () => {      
      const newVideo = Object.assign({}, videoToCreate, { description: undefined });;
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(newVideo);
      
      assert.include(parseTextFromHTML(response.text, 'form'), 'Description is required');
    });

    it('renders the video form with other fields if url is missed', async () => {
      const newVideo = Object.assign({}, videoToCreate, { url: undefined });;
      const response = await request(app)
          .post('/videos')
          .type('form')
          .send(newVideo);
      const video = await Video.findOne({});

      assert.include(parseTextFromHTML(response.text, '#description-input'), newVideo.description);
      assert.include(getValue(response.text, '#title-input'), newVideo.title);
    });

    it('request without url should display an error message', async () => {      
      const newVideo = Object.assign({}, videoToCreate, { url: undefined });;
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(newVideo);
      
      assert.include(parseTextFromHTML(response.text, 'form'), 'a URL is required');
    });
});

describe('Server path: /videos/:id', () => {
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);

  describe('GET', () => {
    it('renders the video', async () => {
      const video = await seedVideoToDatabase();

      const response = await request(app)
        .get(`/videos/${video._id}`);

      assert.include(parseTextFromHTML(response.text, 'body'), video.title);
      assert.include(parseTextFromHTML(response.text, 'body'), video.description);
      assert.include(parseAttributeFromHTML('src')(response.text, 'iframe'), video.url);
    });
  });
});

describe('Server path: /videos/:id/edit', () => {
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);

  describe('GET', () => {
    it('renders the form for update a video', async () => {
      const video = await seedVideoToDatabase();

      const response = await request(app)
        .get(`/videos/${video._id}/edit`);

      assert.include(getValue(response.text, '#title-input'), video.title);
      assert.include(getValue(response.text, '#description-input'), video.description);
      assert.include(getValue(response.text, '#url-input'), video.url);
    });
  });
});


describe('Server path: /videos/:id/updates', () => {
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);

  describe('POST', () => {
    it('save the existing video with the new data', async () => {
      const oldVideo = await seedVideoToDatabase();
      const newVideo = buildVideoObject({ title: 'New title!' });

      const response = await request(app)
        .post(`/videos/${oldVideo._id}/updates`)
        .type('form')
        .send(newVideo);

      const videoFound = await Video.findById(oldVideo._id);

      assert.strictEqual(oldVideo._id.toString(), videoFound._id.toString());
      assert.strictEqual(newVideo.title, videoFound.title);
      assert.strictEqual(newVideo.description, videoFound.description);
      assert.strictEqual(newVideo.url, videoFound.url);
    });

    it('should not possible to update an empty title', async () => {
      const oldVideo = await seedVideoToDatabase();
      const newVideo = buildVideoObject();

      newVideo.title = undefined;

      const response = await request(app)
        .post(`/videos/${oldVideo._id}/updates`)
        .type('form')
        .send(newVideo);

      assert.equal(response.status, 400);
      assert.include(parseTextFromHTML(response.text, 'form'), 'Title is required');
    });

    it('should not possible to update an empty description', async () => {
      const oldVideo = await seedVideoToDatabase();
      const newVideo = buildVideoObject();

      newVideo.description = undefined;

      const response = await request(app)
        .post(`/videos/${oldVideo._id}/updates`)
        .type('form')
        .send(newVideo);
      
      assert.equal(response.status, 400);
      assert.include(parseTextFromHTML(response.text, 'form'), 'Description is required');
    });

    it('should not possible to update an empty url', async () => {
      const oldVideo = await seedVideoToDatabase();
      const newVideo = buildVideoObject();

      newVideo.url = undefined;

      const response = await request(app)
        .post(`/videos/${oldVideo._id}/updates`)
        .type('form')
        .send(newVideo);
      
      assert.equal(response.status, 400);
      assert.include(parseTextFromHTML(response.text, 'form'), 'a URL is required');
    });

    it('should redirect to show page', async () => {
      const oldVideo = await seedVideoToDatabase();
      const newVideo = buildVideoObject({ title: 'New title!' });

      const response = await request(app)
        .post(`/videos/${oldVideo._id}/updates`)
        .type('form')
        .send(newVideo);
      
        assert.equal(response.status, 302);
        assert.equal(response.headers.location, `/videos/${oldVideo._id}`);
    });
  });
});

describe('Server path: /videos/:id/deletions', () => {
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);

  describe('POST', () => {
    it('delete the video', async () => {
        const video = await seedVideoToDatabase();

        const response = await request(app)
          .post(`/videos/${video._id}/deletions`)
          .type('form');

        const videos = await Video.find({});
        assert.strictEqual(videos.length, 0);
    });

    it('redirects home', async () => {
      const video = await seedVideoToDatabase();

      const response = await request(app)
        .post(`/videos/${video._id}/deletions`)
        .type('form');

      assert.equal(response.status, 302);
      assert.equal(response.headers.location, '/videos');
    });
  });
});