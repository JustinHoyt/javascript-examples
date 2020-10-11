const IO = require('crocks/IO');
const Result = require('crocks/Result');
const Async = require('crocks/Async');
const R = require('ramda');
const liftA2 = require('crocks/helpers/liftA2');
const { Err, Ok } = Result;
const { Rejected, Resolved } = Async;
const tap = require('crocks/helpers/tap');

/**
 * @param {string | number} number1
 * @param {string | number} number2
 */
function addPositiveIOExample(number1, number2) {
    /**
     * @param {string} value
     */
    const isNumber = (value) => parseInt(value) ? Ok(value) : Err('not a number');
    /**
     * @param {number} value
     */
    const isPositive = (value) => value >= 0 ? Ok(value) : Err('not a positive integer');

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
    /**
     * @param {string} value
     */
    const isNumber = (value) => parseInt(value) ? Ok(value) : Err('not a number');
    /**
     * @param {number} value
     */
    const isPositive = (value) => value >= 0 ? Ok(value) : Err('not a positive integer');

    const validate = R.compose(R.chain(isPositive), isNumber);

    const first = Async.fromPromise(() => new Promise((resolve, reject) => resolve(number1)))();
    const validatedFirst = first.map(validate);
    const second = Async.fromPromise(() => new Promise((resolve, reject) => resolve(number2)))();
    const validatedSecond = second.map(validate);

    const addArgs = R.lift(R.lift(R.add));

    return await addArgs(validatedFirst, validatedSecond).toPromise()
        .then(x => x.either(R.identity, R.identity))
        .catch(x => x.either(R.identity, R.identity));
}

// @ts-ignore
if (require.main === module) {
    console.log(addPositiveAsyncExample(process.argv[2], process.argv[3]));
}

module.exports.addPositive = addPositiveAsyncExample;