const IO = require('crocks/IO');
const Result = require('crocks/Result');
const R = require('ramda');
const liftA2 = require('crocks/helpers/liftA2');
const { Err, Ok } = Result;

function addPositive(a, b) {
    const isNumber = (value) => parseInt(value) ? Ok(value) : Err('not a number');
    const isPositive = (value) => value >= 0 ? Ok(value) : Err('not a positive integer');

    const validate = R.compose(R.chain(isPositive), isNumber);

    const first = IO(() => a).map(validate);
    const second = IO(() => b).map(validate);

    const addArgs = R.lift(R.lift(R.add));

    return addArgs(first, second).run().either(R.identity, R.identity);
}

// @ts-ignore
if (require.main === module) {
    console.log(addPositive(process.argv[2], process.argv[3]));
}

module.exports.addPositive = addPositive;