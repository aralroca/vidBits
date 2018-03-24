const {assert} = require('chai');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');
const Video = require('../../models/video');

describe('Model: Video', () => {
  beforeEach(connectDatabase);

  afterEach(disconnectDatabase);

  describe('title field', () => {
    it('should be a String', () => {
      const title = 30;
      const video = new Video({ title });

      assert.strictEqual(video.title, title.toString());
    });

    it('should be required', () => {
      const video = new Video({});
      video.validateSync();
      assert.strictEqual(video.errors.title.message, 'Path `title` is required.');   
    });
  });

  describe('description field', () => {
    it('should be a String', () => {
      const description = 30;
      const video = new Video({ description });

      assert.strictEqual(video.description, description.toString());
    });

    it('should be required', () => {
      const video = new Video({});
      video.validateSync();
      assert.strictEqual(video.errors.description.message, 'Path `description` is required.');   
    });
  });
});
