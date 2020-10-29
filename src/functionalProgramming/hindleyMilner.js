/* eslint-disable no-unused-vars */
const R = require('ramda');

// strLength :: String -> Number
const strLength = (s) => s.length;

// join :: String -> [String] -> String
const join = R.curry((what, xs) => xs.join(what));

// match :: Regex -> String -> [String]
const match = R.curry((reg, s) => s.match(reg));

// replace :: Regex -> String -> String -> String
const replace = R.curry((reg, sub, s) => s.replace(reg, sub));

// id :: a -> a
const id = (x) => x;

// map :: (a -> b) -> [a] -> [b]
const map = R.curry((f, xs) => xs.map(f));

// head :: [a] -> a
const head = (xs) => xs[0];

// filter :: (a -> Bool) -> [a] -> [a]
const filter = R.curry((f, xs) => xs.filter(f));

// reduce :: ((b, a) -> b) -> b -> [a] -> b
const reduce = R.curry((f, x, xs) => xs.reduce(f, x));
