const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

module.exports = {
  // Get all thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find().populate('reactions');
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Get a thought
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId })
        .populate('reactions');

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Create a thought
  async createThought(req, res) {
    try {
      const user = await User.findOne(new ObjectId(req.body.userId));

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const thought = await Thought.create({
        thoughtText: req.body.thoughtText,
        username: user.username, 
      });

      await User.findOneAndUpdate(
        { _id: new ObjectId(req.body.userId) },
        { $push: { thoughts: new ObjectId(thought._id) } },
        { new: true }
      );

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Update a thought
  async updateThought(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!thought) {
        res.status(404).json({ message: 'No thought with this id!' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Delete a thought
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
  
      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }
  
      const user = await User.findOneAndUpdate(
        { username: thought.username },
        { $pull: { thoughts: thought._id } }, 
        { new: true }
      );
  
      if (!user) {
        return res.status(404).json({ message: 'No user found associated with this thought' });
      }
  
      res.json({ message: 'Thought deleted and user updated!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Add an reaction to a thought
  async addReaction(req, res) {
    try {
      const user = await User.findOne(new ObjectId(req.body.userId));

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      const reaction = {
        reactionBody: req.body.reactionBody,
        username: user.username,
      };

      const thought = await Thought.findOneAndUpdate(
        { _id: new ObjectId(req.params.thoughtId)},
        { $addToSet: { reactions: reaction } },
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    } 
  },

  // Remove reaction from a thought
  async removeReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

};
