const crocksAdd = require('./crocksAdd');
// jest.mock('./crocksAdd');

describe("Add tests", () => {

    test("should add two numbers", () => {
        const first = 2
        const second = 3

        // crocksAdd.add = jest.fn((a, b) => 3);

        // crocksAdd.add.mockResolvedValue((a, b) => 10);


        // const addSpy = jest.spyOn(crocksAdd.add, 'addArgs');
        // addSpy.mockReturnValue(10)

        const output = crocksAdd.addPositive(first, second);

        expect(output).toEqual(5);
    });
});