const JournalEntry = require('../models/JournalEntry');

// Get all journal entries for a user
exports.getJournalEntries = async (req, res) => {
    try {
        const entries = await JournalEntry.find({ user: req.user.id })
            .sort({ createdAt: -1 });
        res.json(entries);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Create a new journal entry
exports.createJournalEntry = async (req, res) => {
    try {
        const newEntry = new JournalEntry({
            content: req.body.content,
            mood: req.body.mood,
            user: req.user.id
        });
        const entry = await newEntry.save();
        res.json(entry);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Update a journal entry
exports.updateJournalEntry = async (req, res) => {
    const { content, mood } = req.body;
    try {
        let entry = await JournalEntry.findById(req.params.id);
        if (!entry) return res.status(404).json({ msg: 'Journal entry not found' });
        if (entry.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
        
        entry = await JournalEntry.findByIdAndUpdate(
            req.params.id,
            { $set: { content, mood } },
            { new: true }
        );
        res.json(entry);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Delete a journal entry
exports.deleteJournalEntry = async (req, res) => {
    try {
        let entry = await JournalEntry.findById(req.params.id);
        if (!entry) return res.status(404).json({ msg: 'Journal entry not found' });
        if (entry.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
        
        await JournalEntry.findByIdAndRemove(req.params.id);
        res.json({ msg: 'Journal entry removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Get journal entry by ID
exports.getJournalEntry = async (req, res) => {
    try {
        const entry = await JournalEntry.findById(req.params.id);
        if (!entry) return res.status(404).json({ msg: 'Journal entry not found' });
        if (entry.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
        
        res.json(entry);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Get journal statistics
exports.getJournalStats = async (req, res) => {
    try {
        const entries = await JournalEntry.find({ user: req.user.id });
        
        // Calculate mood distribution
        const moodCounts = {};
        entries.forEach(entry => {
            if (entry.mood) {
                moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
            }
        });

        // Calculate entries per month (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        const recentEntries = entries.filter(entry => {
            return new Date(entry.createdAt) >= sixMonthsAgo;
        });

        const monthlyStats = {};
        recentEntries.forEach(entry => {
            const month = new Date(entry.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' });
            monthlyStats[month] = (monthlyStats[month] || 0) + 1;
        });

        // Calculate average entries per week
        const totalWeeks = Math.ceil((new Date() - sixMonthsAgo) / (1000 * 60 * 60 * 24 * 7));
        const averageEntriesPerWeek = totalWeeks > 0 ? (recentEntries.length / totalWeeks).toFixed(1) : 0;

        res.json({
            totalEntries: entries.length,
            recentEntries: recentEntries.length,
            moodDistribution: moodCounts,
            monthlyStats,
            averageEntriesPerWeek
        });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Get entries by date range
exports.getEntriesByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        if (!startDate || !endDate) {
            return res.status(400).json({ msg: 'Start date and end date are required' });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Include the entire end date

        const entries = await JournalEntry.find({
            user: req.user.id,
            createdAt: {
                $gte: start,
                $lte: end
            }
        }).sort({ createdAt: -1 });

        res.json(entries);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

