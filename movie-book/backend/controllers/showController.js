const Show = require('../models/Show');

// @desc    Get all shows (with optional filters)
// @route   GET /api/shows
// @access  Public
const getShows = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.movie) filter.movie = req.query.movie;
    if (req.query.theatre) filter.theatre = req.query.theatre;
    if (req.query.date) filter.date = req.query.date;

    const shows = await Show.find(filter)
      .populate('movie', 'title poster duration')
      .populate('theatre', 'name city')
      .populate('screen', 'name rows columns');

    res.json(shows);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single show
// @route   GET /api/shows/:id
// @access  Public
const getShowById = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movie', 'title poster duration')
      .populate('theatre', 'name city address')
      .populate('screen', 'name rows columns');
      
    if (show) {
      res.json(show);
    } else {
      res.status(404);
      return next(new Error('Show not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a show
// @route   POST /api/shows
// @access  Private/Admin
const createShow = async (req, res, next) => {
  try {
    const show = new Show(req.body);
    const createdShow = await show.save();
    res.status(201).json(createdShow);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a show
// @route   PUT /api/shows/:id
// @access  Private/Admin
const updateShow = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id);

    if (show) {
      Object.assign(show, req.body);
      const updatedShow = await show.save();
      res.json(updatedShow);
    } else {
      res.status(404);
      return next(new Error('Show not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a show
// @route   DELETE /api/shows/:id
// @access  Private/Admin
const deleteShow = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id);

    if (show) {
      await show.deleteOne();
      res.json({ message: 'Show removed' });
    } else {
      res.status(404);
      return next(new Error('Show not found'));
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getShows,
  getShowById,
  createShow,
  updateShow,
  deleteShow,
};
