const { constant } = require('crocks/combinators');
const { bichain } = require('crocks/pointfree');
const { Maybe } = require('crocks');
const R = require('ramda');

const { Just, Nothing } = Maybe;

const log = R.tap((val) => console.log(val));

const val = '';
const maybeVal = Maybe.of(val);
const handleCases = bichain(
  (val) => Just("it's empty so i'm in the left case"),
  (val) => Just(`it's a string so i'm in the right case: ${val}`),
);
handleCases(maybeVal).map(log);

const forward = bichain(
  Nothing,
  (val) => Just(val),
);

// forward(Nothing()).map(log);
//= > Just Nothing

forward(Just('just')).map(log);
