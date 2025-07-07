const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getGoals, createGoal, updateGoal, deleteGoal } = require('../controllers/goalController');

router.route('/').get(auth, getGoals).post(auth, createGoal);
router.route('/:id').put(auth, updateGoal).delete(auth, deleteGoal);

module.exports = router;