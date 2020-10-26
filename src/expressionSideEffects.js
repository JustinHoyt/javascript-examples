/* eslint-disable no-cond-assign */
function vowels(str) {
  let matches;

  if (str && (matches = str.match(/[aeiou]/g))) {
    return matches;
  }
  return [];
}

console.log(vowels('hello world'));

module.exports = {};
