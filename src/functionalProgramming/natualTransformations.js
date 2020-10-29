const R = require('ramda');
const { Async, resultToAsync, Result } = require('crocks');
const { composeK } = require('crocks');

const { Ok, Err } = Result;

const print = (prefix) => (x) => console.log(prefix, x);

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

  const validate = R.compose(
    R.chain(resultToAsync),
    R.map(composeK(isPositive, isNumber)),
  );

  const first = Async.fromPromise(() => promise1)();
  const validatedFirst = validate(first);

  const second = Async.fromPromise(() => promise2)();
  const validatedSecond = validate(second);

  const addArgs = R.lift(R.add);

  return addArgs(validatedFirst, validatedSecond).toPromise()
    .then(R.identity)
    .catch(R.identity);
}

async function test() {
  console.log(await addPositiveAsyncExample(2, 3));
}

// @ts-ignore
if (require.main === module) {
  // console.log(addPositiveAsyncExample(process.argv[2], process.argv[3]));
  test();
}

module.exports = {};
