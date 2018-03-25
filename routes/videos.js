const router = require('express').Router();

const Video = require('../models/video');

router.get('/', (req, res, next) => {
  res.redirect('/videos');
})

router.get('/videos', async (req, res, next) => {
  const videos = await Video.find({});
  res.render('videos/index', {videos});
});

router.post('/videos', async (req, res, next) => {
  const { title, description } = req.body;
  const video = new Video({ title, description });

  video.validateSync();

  if(video.errors) {
    res.status(400).render('videos/new', {video});
  } else {
    await video.save();
    const videos = await Video.find({});
    res.status(201).render('videos/index', {videos});
  }
});

router.get('/videos/new', async (req, res, next) => {
  res.render('videos/new');
});

router.get('/videos/:id', async (req, res, next) => {
  const video = await Video.findById(req.params.id);
  res.render('videos/view', {video});
});

module.exports = router;
