const names = [
  'Jones',
  'Zeek',
  'Jared',
  'Clark',
  'Jared',
  'Grace',
  'Kelsey',
  'Alex',
  'Mark',
  'Sarah',
];

const thoughts = [
    'I love my dog',
    'I love my cat',
    'I love my fish',
    'I love my bird',
    'I love my horse',
    'I love my turtle',
    'I love my rabbit',
    'I love my hamster',
    'I love my frog',
    'I love my lizard',
];

const reactions = [
    'I love it too!',
    'I am indifferent to this thought!',
    'I am excited to see it!',
    'I am happy about it!',
    'I am surprised it!',
];

const getRandomArrItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const getRandomName = () => `${getRandomArrItem(names)}`;

const getRandomThoughts = () => {
  const thoughtCount = Math.floor(Math.random() * thoughts.length);
  const thoughtArr = [];
  for (let i = 0; i < thoughtCount; i++) {
    thoughtArr.push(getRandomArrItem(thoughts));
  }
  return thoughtArr;
};

const getRandomReactions = () => {
  const reactionCount = Math.floor(Math.random() * reactions.length);
  const reactionArr = [];
  for (let i = 0; i < reactionCount; i++) {
    reactionArr.push(getRandomArrItem(reactions));
  }
  return reactionArr;
}
    

module.exports = { getRandomName, getRandomThoughts, getRandomReactions };
