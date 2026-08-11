const Theatre = require('../models/Theatre');

// @desc    Get all theatres
// @route   GET /api/theatres
// @access  Public
const getTheatres = async (req, res, next) => {
  try {
    const theatres = await Theatre.find({});
    res.json(theatres);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single theatre
// @route   GET /api/theatres/:id
// @access  Public
const getTheatreById = async (req, res, next) => {
  try {
    const theatre = await Theatre.findById(req.params.id);
    if (theatre) {
      res.json(theatre);
    } else {
      res.status(404);
      return next(new Error('Theatre not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a theatre
// @route   POST /api/theatres
// @access  Private/Admin
const createTheatre = async (req, res, next) => {
  try {
    const theatre = new Theatre(req.body);
    const createdTheatre = await theatre.save();
    res.status(201).json(createdTheatre);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a theatre
// @route   PUT /api/theatres/:id
// @access  Private/Admin
const updateTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.findById(req.params.id);

    if (theatre) {
      Object.assign(theatre, req.body);
      const updatedTheatre = await theatre.save();
      res.json(updatedTheatre);
    } else {
      res.status(404);
      return next(new Error('Theatre not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a theatre
// @route   DELETE /api/theatres/:id
// @access  Private/Admin
const deleteTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.findById(req.params.id);

    if (theatre) {
      await theatre.deleteOne();
      res.json({ message: 'Theatre removed' });
    } else {
      res.status(404);
      return next(new Error('Theatre not found'));
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTheatres,
  getTheatreById,
  createTheatre,
  updateTheatre,
  deleteTheatre,
};
