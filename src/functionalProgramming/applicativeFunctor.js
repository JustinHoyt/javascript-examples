/* eslint-disable no-unused-vars */
const R = require('ramda');
const Maybe = require('./DataTypes/MaybeJS');

const print = (prefix) => (x) => console.log(prefix, x);

// We can't do this because the numbers are bottled up.
R.tap(print('adding alone:'), R.add(Maybe.of(2), Maybe.of(3)));
// NaN

// We could do it like this
R.tap(print('chain and mapping:'), Maybe.of(2).chain((two) => Maybe.of(3).map(R.add(two))));
// Maybe(add(5))

/**
 * We can add a new method onto our functor to simplify this process
 */
R.tap(print('ap:'), Maybe.of(2).map(R.add).ap(Maybe.of(3)));
// Maybe(add(5))

// How ap works
Maybe.prototype.ap = function ap(otherContainer) {
  return otherContainer.map(this.$value);
};

/**
 *  We can achieve pointfree applicative calls with Lift functions of various
 *  arity
 */
const liftA2 = R.curry((g, f1, f2) => f1.map(g).ap(f2));
const liftA3 = R.curry((g, f1, f2, f3) => f1.map(g).ap(f2).ap(f3));

R.tap(print('liftA2:'), liftA2(R.add, Maybe.of(2), Maybe.of(3)));

module.exports = {};
