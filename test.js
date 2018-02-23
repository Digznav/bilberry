const npmName = require('npm-name');

const name = 'carrot';

console.log(name);
npmName(name)
  .then(available => console.log(available))
  .catch(err => console.log(err));
