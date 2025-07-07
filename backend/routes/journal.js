const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { 
    getJournalEntries, 
    createJournalEntry, 
    updateJournalEntry, 
    deleteJournalEntry,
    getJournalEntry,
    getJournalStats,
    getEntriesByDateRange
} = require('../controllers/journalController');

// @route   GET /api/journal
// @desc    Get all journal entries for user
// @access  Private
router.get('/', auth, getJournalEntries);

// @route   POST /api/journal
// @desc    Create a new journal entry
// @access  Private
router.post('/', auth, createJournalEntry);

// @route   GET /api/journal/stats
// @desc    Get journal statistics
// @access  Private
router.get('/stats', auth, getJournalStats);

// @route   GET /api/journal/range
// @desc    Get entries by date range
// @access  Private
router.get('/range', auth, getEntriesByDateRange);

// @route   GET /api/journal/:id
// @desc    Get specific journal entry
// @access  Private
router.get('/:id', auth, getJournalEntry);

// @route   PUT /api/journal/:id
// @desc    Update a journal entry
// @access  Private
router.put('/:id', auth, updateJournalEntry);

// @route   DELETE /api/journal/:id
// @desc    Delete a journal entry
// @access  Private
router.delete('/:id', auth, deleteJournalEntry);

module.exports = router;

