const IO = require('crocks/IO');
const Result = require('crocks/Result');
const Async = require('crocks/Async');
const R = require('ramda');

const { Err, Ok } = Result;
const resultToAsync = require('crocks/Async/resultToAsync');
const composeK = require('crocks/helpers/composeK');

/**
 * @param {string | number} number1
 * @param {string | number} number2
 */
function addPositiveIOExample(number1, number2) {
  /**
     * @param {string} value
     */
  const isNumber = (value) => (parseInt(value, 10) ? Ok(value) : Err('not a number'));
  /**
     * @param {number} value
     */
  const isPositive = (value) => (value >= 0 ? Ok(value) : Err('not a positive integer'));

  const validate = R.compose(R.chain(isPositive), isNumber);

  const first = IO(() => number1);
  const validatedFirst = first.map(validate);
  const second = IO(() => number2);
  const validatedSecond = second.map(validate);

  const addArgs = R.lift(R.lift(R.add));

  return addArgs(validatedFirst, validatedSecond).run().either(R.identity, R.identity);
}

/**
 * @param {string | number} number1
 * @param {string | number} number2
 */
async function addPositiveAsyncExample(number1, number2) {
  const promise1 = new Promise((resolve) => resolve(number1));
  const promise2 = new Promise((resolve) => resolve(number2));
  /**
     * @param {string} value
     */
  const isNumber = (value) => (parseInt(value, 10) ? Ok(value) : Err('not a number'));
  /**
     * @param {number} value
     */
  const isPositive = (value) => (value >= 0 ? Ok(value) : Err('not a positive integer'));

  const validate = composeK(isPositive, isNumber);

  const first = Async.fromPromise(() => promise1)();
  const validatedFirst = first.map(validate).chain(resultToAsync);

  const second = Async.fromPromise(() => promise2)();
  const validatedSecond = second.map(validate).chain(resultToAsync);

  const addArgs = R.lift(R.add);

  return addArgs(validatedFirst, validatedSecond).toPromise()
    .then(R.identity)
    .catch(R.identity);
}

async function test() {
  console.log(await addPositiveAsyncExample(process.argv[2], process.argv[3]));
}

// @ts-ignore
if (require.main === module) {
  // console.log(addPositiveAsyncExample(process.argv[2], process.argv[3]));
  test();
}

module.exports.addPositive = addPositiveAsyncExample;
module.exports.addPositiveIO = addPositiveIOExample;
