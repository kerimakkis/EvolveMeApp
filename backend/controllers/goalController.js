const Goal = require('../models/Goal');

exports.getGoals = async (req, res) => {
    try {
        const goals = await Goal.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(goals);
    } catch (err) { res.status(500).send('Server Error'); }
};

exports.createGoal = async (req, res) => {
    try {
        const newGoal = new Goal({
            title: req.body.title,
            description: req.body.description,
            user: req.user.id,
        });
        const goal = await newGoal.save();
        res.json(goal);
    } catch (err) { res.status(500).send('Server Error'); }
};

exports.updateGoal = async (req, res) => {
    const { title, description, isCompleted } = req.body;
    try {
        let goal = await Goal.findById(req.params.id);
        if (!goal) return res.status(404).json({ msg: 'Goal not found' });
        if (goal.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
        goal = await Goal.findByIdAndUpdate(req.params.id, { $set: { title, description, isCompleted } }, { new: true });
        res.json(goal);
    } catch (err) { res.status(500).send('Server Error'); }
};

exports.deleteGoal = async (req, res) => {
    try {
        let goal = await Goal.findById(req.params.id);
        if (!goal) return res.status(404).json({ msg: 'Goal not found' });
        if (goal.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
        await Goal.findByIdAndRemove(req.params.id);
        res.json({ msg: 'Goal removed' });
    } catch (err) { res.status(500).send('Server Error'); }
};