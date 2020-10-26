/* eslint-disable no-console */
function Person(saying) {
  this.saying = saying;
}

Person.prototype.talk = function talk() {
  console.log('I say: ', this.saying);
};

function new1(constructor, ...args) {
  const obj = {};
  Object.setPrototypeOf(obj, constructor.prototype);
  return constructor.apply(obj, args) || obj;
}

const crockford = new1(Person, 'semicolons');
crockford.talk();

module.exports = {};
