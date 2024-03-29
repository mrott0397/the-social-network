const { Schema, model } = require('mongoose');
const ReactionSchema = require('./Reaction');

// const ReactionSchema = new Schema(
//     {
//         // set custom id to avoid confusion with parent thought _id
//         reactionId: {
//             type: Schema.Types.ObjectId,
//             // default value is set to a new ObjectId
//             default: () => new Types.ObjectId()
//         },
//         reactionBody: {
//             type: String,
//             required: true,
//             // must be between 1 and 280 characters
//             maxlength: 280
//         },
//         username: {
//             type: String,
//             required: true
//         },
//         // use Moment.js to format createdAt data
//         createdAt: {
//             type: Date,
//             default: Date.now,
//             // use getter method to format timestamp
//             get: createdAtVal => dateFormat(createdAtVal)
//         }
//     },
//     // add virtuals field to schema
//     {
//         toJSON: {
//             getters: true
//         },
//         id: false
//     }
// );

const ThoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            // must be between 1 and 280 characters
            minlength: 1,
            maxlength: 280
        },
        createdAt: {
            type: Date,
            default: Date.now,
            // use getter method to format timestamp
            get: createdAtVal => dateFormat(createdAtVal)
        },
        username: {
            type: String,
            required: true
        },
        // use ReactionSchema to validate data for a reply
        reactions: [ReactionSchema]
    },
    // add virtuals field to schema
    {
        toJSON: {
            virtuals: true,
        },
        id: false
    }
);

const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;