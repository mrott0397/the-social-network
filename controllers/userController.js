// const { ObjectId } = require('mongodb').Types;
const  User  = require('../models/User');

module.exports = {
    // get all users
    async getAllUsers(req, res) {
        try {
            const dbUserData = await User.find({}).populate('thoughts').populate('friends');
            res.json(dbUserData);
        }
        catch(err) {
            console.log(err);
            res.status(500).json(err);
        };
    },
    // get one user by id
    async getUserById({ params }, res) {
        try {
            const dbUserData = await User.findOne({ _id: params.id }).populate('thoughts').populate('friends');
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id!' });
                return;
            };
            res.json(dbUserData);
        }
        catch(err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    // create user
    async createUser({ body }, res) {
        try {
            const dbUserData = await User.create(body);
            res.json(dbUserData);
        }
        catch(err) {
            console.log(err);
            res.status(500).json(err);
        };
    },
    // update user by id
    async updateUser({ params, body }, res) {
        try {
            const dbUserData = User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true });
        }
        catch(err) {
            console.log(err);
            res.status(500).json(err);
        };
    },
    // delete user
    async deleteUser({ params }, res) {
        try {
            const dbUserData = await User.findOneAndDelete({ _id: params.id });
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id!' });
                return;
            };
            // remove user's thoughts
            await Thought.deleteMany({ username: dbUserData.username });
            // remove user from friends list
            await User.updateMany(
                { _id: { $in: dbUserData.friends } },
                { $pull: { friends: params.id } }
            );
            res.json({ message: 'User and associated thoughts deleted!' });
        }
        catch(err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    // add friend
    async addFriend({ params }, res) {
        try {
            const dbUserData = await User.findOneAndUpdate(
                { _id: params.userId },
                { $addToSet: { friends: params.friendId } },
                { new: true }
            );
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id!' });
                return;
            };
            res.json(dbUserData);
        }
        catch(err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    // remove friend
    async removeFriend({ params }, res) {
        try {
            const dbUserData = await User.findOneAndUpdate(
                { _id: params.userId },
                { $pull: { friends: params.friendId } },
                { new: true }
            );
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id!' });
                return;
            };
            res.json({ message: 'Friend removed!' });
        }
        catch(err) {
            console.log(err);
            res.status(500).json(err);
        }
    }
};