const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { 
    getHabits, 
    createHabit, 
    updateHabit, 
    deleteHabit, 
    completeHabit,
    getHabitStats 
} = require('../controllers/habitController');

// @route   GET /api/habits
// @desc    Get all habits for user
// @access  Private
router.get('/', auth, getHabits);

// @route   POST /api/habits
// @desc    Create a new habit
// @access  Private
router.post('/', auth, createHabit);

// @route   PUT /api/habits/:id
// @desc    Update a habit
// @access  Private
router.put('/:id', auth, updateHabit);

// @route   DELETE /api/habits/:id
// @desc    Delete a habit
// @access  Private
router.delete('/:id', auth, deleteHabit);

// @route   POST /api/habits/:id/complete
// @desc    Mark habit as completed for today
// @access  Private
router.post('/:id/complete', auth, completeHabit);

// @route   GET /api/habits/:id/stats
// @desc    Get habit statistics
// @access  Private
router.get('/:id/stats', auth, getHabitStats);

module.exports = router;

