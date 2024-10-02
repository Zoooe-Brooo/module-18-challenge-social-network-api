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
  const usedNames = new Set(); 

  for (let i = 0; i < 5; i++) {
    let username;
    do {
      username = getRandomName(); 
    } while (usedNames.has(username));
    
    usedNames.add(username);

    const thoughts = getRandomThoughts();
    const thoughtIds = await Promise.all(thoughts.map(async (thoughtText) => {
      const thought = await Thought.create({ thoughtText, username });
      return thought._id;
    }));

    users.push({
      username,
      email: `${username}@mail.com`,
      thoughts: thoughtIds, 
      friends: [], 
    });
  }

  const createdUsers = await User.create(users);

  for (const user of createdUsers) {
    const friends = createdUsers
      .filter(u => u._id.toString() !== user._id.toString()) 
      .map(u => u._id) // Get their _id
      .sort(() => 0.5 - Math.random()) 
      .slice(0, Math.floor(Math.random() * createdUsers.length)); 

    await User.findOneAndUpdate(
      { _id: user._id },
      { $set: { friends } } 
    );
  }

  const allThoughts = await Thought.find();
  for (const thought of allThoughts) {
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