const R = require('ramda');

const Result = require('crocks/Result');
const Sum = require('./DataTypes/Sum');

const { Ok, Err } = Result;
const print = (prefix) => (x) => console.log(prefix, x);

/** @type fold :: Monoid m => m -> [m] -> m */
const fold = R.reduce(R.concat);

const two = Sum.of(2);
const three = Sum.of(3);
const four = Sum.of(4);

fold(Ok([]), [Ok([1, 2, 3]), (Ok([4, 5, 6]))])
  .either(print('failed Err([]):'), print('success Ok([]):'));

fold(Ok([]), [Ok([1, 2, 3]), (Err([4, 5, 6]))])
  .either(print('failed Err([]):'), print('success Ok([]):'));

R.tap(print('concat Sum(int):'), fold(Sum.empty(), [two, three, four]));

module.exports = {};
