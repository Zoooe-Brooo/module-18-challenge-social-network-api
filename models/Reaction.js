const { Schema, Types } = require('mongoose');

const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280,
    },
    username: {
      type: String,
      required: true,
    },
    createAt: {
      type: Date,
      default: Date.now(),
      get: (timestamp) => new Date(timestamp).toLocaleString(),
    },
  },
  {
    toJSON: {
      getters: true,
    },
    _id: false,
  }
);

module.exports = reactionSchema;