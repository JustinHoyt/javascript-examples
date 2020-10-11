const crocksAdd = require('./crocksAdd');
// jest.mock('./crocksAdd');

describe("Add tests", () => {

    test("should add two numbers", async () => {
        const first = 2
        const second = 3

        const output = await crocksAdd.addPositive(first, second);

        expect(output).toEqual(5);
    });
    test("should error on negative numbers", async () => {
        const first = 2
        const second = -3

        const output = await crocksAdd.addPositive(first, second);

        expect(output).toEqual('not a positive integer');
    });
});