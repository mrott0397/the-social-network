const { Schema, Types } = require('mongoose');

const ReactionSchema = new Schema(
    {
        // set custom id to avoid confusion with parent thought _id
        reactionId: {
            type: Schema.Types.ObjectId,
            // default value is set to a new ObjectId
            default: () => new Types.ObjectId()
        },
        reactionBody: {
            type: String,
            required: true,
            // must be between 1 and 280 characters
            maxlength: 280
        },
        username: {
            type: String,
            required: true
        },
        // use Moment.js to format createdAt data
        createdAt: {
            type: Date,
            default: Date.now,
            // use getter method to format timestamp
            // get: createdAtVal => dateFormat(createdAtVal)
        }
    },
    // add virtuals field to schema
    {
        toJSON: {
            getters: true
        },
        id: false
    }
);

module.exports = ReactionSchema;