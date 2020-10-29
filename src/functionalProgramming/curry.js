const R = require('ramda');

const add = (x) => (y) => x + y;
const increment = add(1);
const addTen = add(10);

increment(2); // 3
addTen(2); // 12

const filterAs = (xs) => R.filter((x) => x.match(/a/i), xs);

/**
 * Pointfree functions are functions which are not called on an object
 * by making match curried and pointfree, we make composition with it easier
 */
const match = (exp) => (x) => x.match(exp);
const filterAsPointFree = R.filter(match(/a/i));

const words = ['foo', 'bar', 'baz'];
console.log(filterAs(words));
console.log(filterAsPointFree(words));
