const router = require('express').Router();

const Video = require('../models/video');

router.post('/videos', async (req, res, next) => {
  const { title, description } = req.body;
  const newVideo = new Video({ title, description });

  newVideo.validateSync();

  if(newVideo.errors) {
    res.status(400).render('create', {newVideo});
  } else {
    await newVideo.save();
    res.status(201).send();
  }
});

module.exports = router;
