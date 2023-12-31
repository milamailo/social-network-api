const { User, Thought } = require('../models');

module.exports = {
    
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find();
            res.json(thoughts);
        } 
        catch (err) {
            res.status(500).json(err);
        }
    },
    
    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId })
                .select('-__v');
            if (!thought) {
                return res.status(404).json({ message: `Thought with the ID ${req.params.thoughtId} NOT found` });
            }
            res.json(thought);
        } 
        catch (err) {
            res.status(500).json(err);
        }
    },
    
    async createThought(req, res) {
        try {
            const thought = await Thought.create(req.body);
            const user = await User.findOneAndUpdate(
                { username: req.body.username }, 
                { $push: { thoughts: thought._id } }, 
                { new: true });
            if (!user) {
                return res.status(404).json({ 
                    message: "Thought created without being connect to any user" 
                });
            }
            res.json(thought);
        } 
        catch (err) {
            return res.status(500).json(err);
        }
    },

    async deleteThought(req, res) {
        try {
            const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
            if (!thought) {
                return res.status(404).json({ message: `Thought with the ID ${req.params.thoughtId} NOT found` });
            }
            const user = User.findOneAndUpdate(
                { username: thought.username }, 
                { $pull: { thoughts: req.params.thoughtId } }, 
                { new: true });
            res.json({ message: 'Thought deleted and remove from the user.' });
        } 
        catch (err) {
            res.status(500).json(err);
        }
    },
    
    async updateThought(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                { runValidators: true, new: true }
            );
            if (!thought) {
                return res.status(404).json({ message: `Thought with the ID ${req.params.thoughtId} NOT found` });
            }
            res.json(thought);
        } 
        catch (err) {
            res.status(500).json(err);
        }
    },
    
    async createReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $push: { reactions: req.body } },
                { new: true }
            )
            // const thought = await Thought.findOne({ _id: req.params.thoughtId })
            if (!thought) {
                return res.status(404).json({ message: `No reaction found with the thought ID ${req.params.thoughtId}.`});
            }
            res.json(thought);
        }
        catch (err) {
            res.status(500).json(err);
        }
    },
    
    async deleteReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { reactionId: req.body.reactionId } } },
                { runValidators: true, new: true })
            if (!thought) {
                return res.status(404).json({ message: `No thought found with the reaction ID ${req.params.reactionId}.` });
            }
            res.json(thought);
        }
        catch (err) {
            res.status(404).json({ message: `No reaction with the thought ID ${req.params.thoughtId}.` })
        }
    }
};
