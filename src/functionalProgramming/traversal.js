const R = require('ramda');
const {
  List, Either, IO, Maybe, Async,
} = require('crocks');

const { Left } = Either;

const print = (prefix) => (x) => console.log(prefix, x.type);

R.tap(print("[Just('the facts')]:"), R.sequence(List.of, Maybe.of(List.of(['the facts'])))); // [Just('the facts')]
R.tap(print("IO(Right('buckle my shoe')):"), R.sequence(IO.of, Either.of(IO.of('buckle my shoe')))); // IO(Right('buckle my shoe'))
R.tap(print("Right(['wing']):"), R.sequence(Either.of, [Either.of('wing')])); // Right(['wing'])
R.tap(print("Task(Left('wing')):"), R.sequence(Async.of, Left('wing'))); // Task(Left('wing'))
