const R = require('ramda');
const { Result, IO } = require('crocks');
const { Err, Ok } = Result;

const first = IO.of(() => process.argv[2] ? Ok(process.argv[2]) : Err('first arg invalid'));
const second = IO.of(() => process.argv[3] ? Ok(process.argv[3]) : Err('second arg invalid'));

const mAdd = R.liftN(2, R.add);
const mAdd2 = R.liftN(2, mAdd);
const result = mAdd2(first, second).run();
console.log(result);

const val1 = Ok(Ok("1"));
const val2 = Ok(Ok("2"));

const resultVal = mAdd2(val1, val2);
console.log(resultVal.either(R.identity, (x) => x.either(R.identity, R.identity)));


console.log('done');
// const resultFive = Result.Ok(undefined);
// console.log(resultFive.either(() => 'it broke', () => 'it worked'));

// const maybeFive = Maybe.of(5);
// console.log(maybeFive.either(R.identity, R.identity));

// const myIO = IO.of(() => 8);
