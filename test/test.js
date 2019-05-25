const { expect } = require('chai');
const capitalize = require('../capitalize');

console.log(process.env.NODE_ENV);

describe('#capitalize()', () => {
  it('should capitalize all words of the string', () => {
    expect(capitalize('lorem Ipsum Dolor Sit Amet.')).to.equal('Lorem Ipsum Dolor Sit Amet.');
  });
});

