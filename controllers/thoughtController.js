const  Thought = require('../models/Thought');
const User = require('../models/User');

module.exports = {
    // get all thoughts
    async getAllThoughts(req, res) {
        try {
            const dbThoughtData = await Thought.find({});
            res.json(dbThoughtData);
        }
        catch(err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    // get one thought by id
    async getThoughtById({ params }, res) {
        try {
            const dbThoughtData = await Thought.findOne({ _id: params.id });
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id!' });
                return;
            };
            res.json(dbThoughtData);
        }
        catch(err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    // create thought
    async createThought({ body }, res) {
        try {
            const dbThoughtData = await Thought.create(body);
            // find user to push thought's _id to user's thoughts array field
            const dbUserData = await User.findOneAndUpdate(
                { _id: body.userId },
                { $push: { thoughts: dbThoughtData._id } },
                { new: true }
            );
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id!' });
                return;
            };
            res.json(dbThoughtData);
        }
        catch(err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    // update thought by id
    async updateThought({ params, body }, res) {
        try {
            const dbThoughtData = await
            Thought.findOneAndUpdate( { _id: params.id }, body, { new: true, runValidators: true });
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id!' });
                return;
            }
            res.json(dbThoughtData);
        }
        catch(err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    // delete thought
    async deleteThought({ params }, res) {
        try {
            const dbThoughtData = await Thought.findOneAndDelete({ _id: params.id });
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id!' });
                return;
            };
            // find user to pull thought's _id from user's thoughts array field
            const dbUserData = await User.findOneAndUpdate(
                { username: dbThoughtData.username },
                { $pull: { thoughts: params.id } },
                { new: true }
            );
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this username!' });
                return;
            };
            res.json({ message: 'Thought successfully deleted!' });
        }

        catch(err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    // add reaction
    async addReaction({ params, body }, res) {
        try {
            const dbThoughtData = await Thought.findOneAndUpdate(
                { _id: params.thoughtId },
                { $push: { reactions: body } },
                { new: true, runValidators: true }
            );
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id!' });
                return;
            };
            res.json(dbThoughtData);
        }
        catch(err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    // delete reaction
    async deleteReaction({ params }, res) {
        try {
            const dbThoughtData = await Thought.findOneAndUpdate(
                { _id: params.thoughtId },
                { $pull: { reactions: { reactionId: params.reactionId } } },
                { new: true }
            );
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id!' });
                return;
            };
            res.json({ message: 'Reaction successfully deleted!' });
        }
        catch(err) {
            console.log(err);
            res.status(500).json(err);
        }
    }
};

