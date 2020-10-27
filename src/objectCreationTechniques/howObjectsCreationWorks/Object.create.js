const Person = {
  init(saying) {
    this.saying = saying;
    return this;
  },

  talk() {
    console.log(`I say: ${this.saying}`);
  },
};

function create(constuctor) {
  const obj = {};
  Object.setPrototypeOf(obj, constuctor);
  return obj;
}

const crockford = create(Person).init('semicolons');
crockford.talk();

module.exports = {};
