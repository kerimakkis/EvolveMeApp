const Habit = require('../models/Habit');

// Get all habits for a user
exports.getHabits = async (req, res) => {
    try {
        const habits = await Habit.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(habits);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Create a new habit
exports.createHabit = async (req, res) => {
    try {
        const newHabit = new Habit({
            title: req.body.title,
            user: req.user.id,
            completedDates: []
        });
        const habit = await newHabit.save();
        res.json(habit);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Update a habit
exports.updateHabit = async (req, res) => {
    const { title } = req.body;
    try {
        let habit = await Habit.findById(req.params.id);
        if (!habit) return res.status(404).json({ msg: 'Habit not found' });
        if (habit.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
        
        habit = await Habit.findByIdAndUpdate(
            req.params.id,
            { $set: { title } },
            { new: true }
        );
        res.json(habit);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Delete a habit
exports.deleteHabit = async (req, res) => {
    try {
        let habit = await Habit.findById(req.params.id);
        if (!habit) return res.status(404).json({ msg: 'Habit not found' });
        if (habit.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
        
        await Habit.findByIdAndRemove(req.params.id);
        res.json({ msg: 'Habit removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Mark habit as completed for today
exports.completeHabit = async (req, res) => {
    try {
        let habit = await Habit.findById(req.params.id);
        if (!habit) return res.status(404).json({ msg: 'Habit not found' });
        if (habit.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if already completed today
        const alreadyCompleted = habit.completedDates.some(date => {
            const completedDate = new Date(date);
            completedDate.setHours(0, 0, 0, 0);
            return completedDate.getTime() === today.getTime();
        });

        if (alreadyCompleted) {
            return res.status(400).json({ msg: 'Habit already completed today' });
        }

        habit.completedDates.push(today);
        await habit.save();
        res.json(habit);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Get habit statistics
exports.getHabitStats = async (req, res) => {
    try {
        const habit = await Habit.findById(req.params.id);
        if (!habit) return res.status(404).json({ msg: 'Habit not found' });
        if (habit.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Calculate current streak
        let currentStreak = 0;
        let tempDate = new Date(today);
        
        while (true) {
            const isCompleted = habit.completedDates.some(date => {
                const completedDate = new Date(date);
                completedDate.setHours(0, 0, 0, 0);
                return completedDate.getTime() === tempDate.getTime();
            });

            if (isCompleted) {
                currentStreak++;
                tempDate.setDate(tempDate.getDate() - 1);
            } else {
                break;
            }
        }

        // Calculate total completions
        const totalCompletions = habit.completedDates.length;

        // Calculate completion rate (last 30 days)
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentCompletions = habit.completedDates.filter(date => {
            return new Date(date) >= thirtyDaysAgo;
        }).length;

        const completionRate = Math.round((recentCompletions / 30) * 100);

        res.json({
            habit,
            stats: {
                currentStreak,
                totalCompletions,
                completionRate,
                recentCompletions
            }
        });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

