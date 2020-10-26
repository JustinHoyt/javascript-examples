import R from 'ramda';

const vowels = (str) => str?.match(/[aeiou]/g);

console.log(R.add(1, 2));
console.log(vowels(''));
console.log(vowels('hello world'));
