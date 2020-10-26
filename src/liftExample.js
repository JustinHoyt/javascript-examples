const R = require('ramda');
const Result = require('crocks/Result');

const mEquals = R.lift(R.equals);
const isEqual = mEquals(Result.of('hello'), Result.of('hello'));
const inspectEqual = isEqual.inspect();
const gotError = Result.Err('oops');

console.log(inspectEqual);
console.log(isEqual.either(R.identity, R.identity));
console.log(gotError.either(R.identity, R.identity));
