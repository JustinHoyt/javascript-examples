// @ts-ignore
// eslint-disable-next-line no-unused-vars
const runtime = require('regenerator-runtime/runtime');
const crocksAdd = require('../src/crocksAdd');

describe('Add tests', () => {
  test('should add two numbers', async () => {
    const first = 2;
    const second = 3;

    const output = await crocksAdd.addPositive(first, second);

    expect(output).toEqual(5);
  });

  test('should error on negative numbers', async () => {
    const first = 2;
    const second = -3;

    const output = await crocksAdd.addPositive(first, second);

    expect(output).toEqual('not a positive integer');
  });

  test('should error on unparsable numbers', async () => {
    const first = 2;
    const second = 'hello';

    const output = await crocksAdd.addPositive(first, second);

    expect(output).toEqual('not a number');
  });
});
