const R = require('ramda');
const Result = require('folktale/result');
const Maybe = require('folktale/maybe');

const mEquals = R.lift(R.equals);
const isEqual = mEquals(Result.of('hello'), Result.of('hello'));
const inspectEqual = isEqual.inspect();
const gotError = Result.Error('oops');

console.log(inspectEqual);
console.log(isEqual.getOrElse());


console.log(Result.Error('oops').getOrElse('lol didnt get'));
console.log(Result.Ok.hasInstance(Result.Error('oops')));