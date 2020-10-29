const R = require('ramda');

/**
 * fuctors are very simply objects that implement a mappable interface
 */

// simplified functor class
class Maybe {
  static of(x) {
    return new Maybe(x);
  }

  get isNothing() {
    return this.$value === null || this.$value === undefined;
  }

  constructor(x) {
    this.$value = x;
  }

  map(fn) {
    return this.isNothing ? this : Maybe.of(fn(this.$value));
  }
}

const print = (x) => console.log(x);

R.tap(print, Maybe.of({ name: 'Boris' })
  .map(R.prop('age'))
  .map(R.add(10)));
// Nothing

R.tap(print, Maybe.of({ name: 'Dinah', age: 14 })
  .map(R.prop('age'))
  .map(R.add(10)));
// Just(24)

// accociative property example

// compose(map(f), map(g)) === map(compose(f, g));

const addAge = R.compose(R.map(R.tap(print)),
  R.map(R.add(10)),
  R.map(R.prop('age')));

addAge((Maybe.of({ name: 'Dinah', age: 14 })));

const addAge2 = R.map(R.compose(
  R.tap(print),
  R.add(10),
  R.prop('age'),
));

addAge2((Maybe.of({ name: 'Dinah', age: 14 })));
