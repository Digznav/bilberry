const chai = require('chai');
const capitalize = require('../capitalize');

describe('#capitalize()', () => {
  it('should capitalize all words of the string', () => {
    chai.expect(capitalize('lorem Ipsum Dolor Sit Amet.')).to.equal('Lorem Ipsum Dolor Sit Amet.');
  });
});

