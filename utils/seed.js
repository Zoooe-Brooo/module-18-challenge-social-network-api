const connection = require('../config/connection');
const { User, Thought } = require('../models');
const { getRandomName, getRandomThoughts, getRandomReactions } = require('./data');

connection.on('error', (err) => err);

connection.once('open', async () => {
  console.log('connected');

    let thoughtsCheck = await connection.db.listCollections({ name: 'thoughts' }).toArray();
    if (thoughtsCheck.length) {
      await connection.dropCollection('thoughts');
    }

    let usersCheck = await connection.db.listCollections({ name: 'users' }).toArray();
    if (usersCheck.length) {
      await connection.dropCollection('users');
    }

  const users = [];

  for (let i = 0; i < 5; i++) {
    const username = getRandomName(); 
    const thoughts = getRandomThoughts();

    users.push({
      username,
      thoughts,
    });
  }

  await User.create(users);

  const thoughts = users.reduce((acc, user) => acc.concat(user.thoughts), []);
  const thoughtData = await Thought.create(thoughts);

  for (const thought of thoughtData) {
    const reactions = getRandomReactions();
    for (const reaction of reactions) {
      await Thought.findOneAndUpdate(
      { _id: thought._id },
      { $addToSet: { reactions: { reactionBody: reaction, username: getRandomName() } } },
      { runValidators: true }
      );
    }
  }

  console.table(users);
  console.info('Seeding complete! 🌱');
  process.exit(0);
});
