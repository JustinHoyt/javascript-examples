// @ts-nocheck
const R = require('ramda');

/**
 * @typedef {Object} Prop
 * @property {number} [growthPercentage]
 * @property {number} [yearsOfSavings]
 * @property {number} initialSavings
 * @property {number} annualSavingsRate
 */

const applyN = R.compose(R.reduceRight(R.compose, R.identity), R.repeat);

const growNetWorth = (amountSavedYearly, growth) => (initialAmount) => (
  initialAmount * growth + amountSavedYearly
);

/**
 * Calculates retirement net worth based on a simple set of params
 *
 * @param {Prop} props
 * @returns {number}
 */
function retirement(props) {
  const {
    growthPercentage = 1.07, initialSavings, yearsOfSavings = 40, annualSavingsRate,
  } = props;

  const annualGrowth = growNetWorth(annualSavingsRate, growthPercentage);
  const netWorth = applyN(annualGrowth, yearsOfSavings)(initialSavings);

  /** @type {Intl.NumberFormatOptions} formatOptions */
  const formatOptions = { style: 'currency', currency: 'USD' };

  return Intl.NumberFormat(formatOptions).format(netWorth);
}

console.log(retirement({ initialSavings: 10000, annualSavingsRate: 20000 }));
