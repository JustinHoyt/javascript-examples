/*
 * Functional programming is highly theoretical, but often
 * times preferable to the alternative when systems become sufficiently volatile.
 */


/*
 * We import the Monads as objects and use maps/chains/folds from that monads's lib.
 * This is due to a limitation in TypeScript's type system.
 */
import * as O from 'fp-ts/lib/Option';
import * as E from 'fp-ts/lib/Either';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';

import { Option } from 'fp-ts/lib/Option';
import { Either } from 'fp-ts/lib/Either';
import { flow, pipe } from 'fp-ts/lib/function';

interface MyMap {
  addresses: [ Address ]
}

interface Address {
  street?: { name: string, number: number },
  postcode?: string,
}

const log = (prefix: string) => (x: unknown) => console.log(prefix, x);

const obj: MyMap = {
  addresses: [
    {
      street: { name: 'Mulburry', number: 8402 },
      postcode: 'WC2N',
    },
  ],
};

const brokenObj: MyMap = {
  addresses: [
    {
      street: { name: 'Mulburry', number: 8402 },
    },
  ],
};


/*
 * Currying is the transformation of a function with multiple
 * arguments into a sequence of single-argument functions
 */
const add = (a, b) => {
    return a + b
}

const addC = a => b => {
    return a + b
}

add(2,3)
addC(2)(3)

const add2 = addC(2)

add2(4) // => 6


/*
 * What is a point-free style of code?
 *
 * A point free style is one in which the code attempts to forgo redundant parameters when they are able to be implicit.
 * This can be abused to make code less readable, but when used in conjunction with functional composition we can achieve
 * declarative code that is still readable thanks to TypeScript's type system.
 */

// Pointed
const logPointed = (msg: string) => console.log(msg);
// Point-free
const logPointFree = console.log;


/*
 * What are pipe and flow?
 */

// pipe accepts the first argument as the starting object to traverse the cascade of funcitions that apply on it
pipe(
    2,
    add2,
    addC(3),
    console.log,
)

// flow accepts the starting object on invocation, making it a point-free pipe
flow(
    add2,
    addC(3),
    console.log,
)(2)


/*
 * OptionaProp is functionally similar to the elvis operator (?.) in JavaScript.
 * Lets use OptionalProp as an example of how to work with monads.
 */
const optionalProp = <T, P extends keyof T>(prop: P) => (obj: T): O.Option<T[P]> => O.of(obj[prop]);

const getAddressMapping: (object: MyMap) => Option<Option<Option<Option<void>>>> = flow(
  O.fromNullable,
  O.map(optionalProp('addresses')),
  O.map(O.map(optionalProp(0))),
  O.map(O.map(O.map(optionalProp('street')))),
  O.map(O.map(O.map(O.map(log('mapping: '))))),
);
// that's a lot of mapping over Options!

getAddressMapping(obj);

/*
 * chain is a map and join combined, keeping monads of the same type from nesting.
 */
type GetProp = (object: MyMap) => Option<unknown>;
const getAddressChaining: GetProp = flow(
  O.fromNullable,
  O.chain(optionalProp('addresses')),
  O.chain(optionalProp(0)),
  O.chain(optionalProp('street')),
  O.fold(() => undefined, (street) => log('chain: ')(street)),
);
getAddressChaining(obj);


/* The typing is limited when understanding how to operate over the values in
 * the monads as they move through the flow operator because they can lose
 * context of previous computed values. For sitations like that use the bind
 * syntax, similar in concept to the Do syntax in Haskell
 *
 * do/bind syntax is more flexible than chain because we can bind variables to
 * the context of the `do` as it goes through the actions.
 */
const getAddressBinding: (object: MyMap) => Option<string> = flow(O.fromNullable,
  O.bindTo('object'),
  O.bind('addresses', ({ object }) => O.of(object.addresses)),
  O.bind('firstAddress', ({ addresses }) => O.of(addresses[0])),
  O.bind('street', ({ firstAddress }) => O.of(firstAddress.street)),
  O.fold(() => undefined, ({ street }) => log('do: ')(street)));

getAddressBinding(obj);


/*
 *
 * Eithers are essential for capturing error states in functional programming.
 * We need the Eithers because we cannot break pipelines by throwing errors.
 * Error states must either be handled or propagated up the call stack.
 *
 * So why use Eithers?
 *
 * 1. Eithers are preferable to try/catch statements
 * because the error is always type-safe. When you use a catch block, the error
 * is always of type unknown. This is inconvenient for you as the client
 * because you need to use instanceof to narrow down the error type. Even worse
 * is when you are forced to define your own custom type guards to do the same
 * thing. With Eithers, we know every possible error state based on the type
 * signature. We can choose to handle them in a switch statement or continue to
 * propagate up the call stack.
 *
 *
 * Try/Catches are essentially special case GOTO statements, which are difficult to understand
 * (see Edsgar Dijkstra's letter explaining why: https://www.cs.utexas.edu/users/EWD/ewd02xx/EWD215.PDF).
 *
 * 3. Lastly, errorable tasks are not checked for error handling in runtime or
 * compile time. For example, promises don't need a try/catch if awaited and do
 * not need a .catch after a .then function. This can lead to uncaught exceptions which are problematic.
 * Turning every promise into a TaskEither enforces error handling during compilation.
 */
async function mockGetAddresses() {
    const obj: MyMap = { addresses: [ { street: { name: 'Mulburry', number: 8402 }, postcode: 'WC2N', }, ], };
    return obj;
}

async function mockGetAddressesRej() {
    return Promise.reject("failed to connect to server");
}

type ValidateAddresses = (addresses: MyMap) => Either<String, MyMap>;

const validateAnAddressExists: ValidateAddresses = (addresses) =>
    addresses?.addresses.length > 0 ? E.right(addresses) : E.left("No addresses exist");

// validateAddressPostcode and validateAddressStreet look to have pretty similar logic
const validateAddressPostcode: ValidateAddresses = (addresses) =>
    addresses.addresses.every(address => 'postcode' in address)
        ? E.right(addresses)
        : E.left("Missing property: postcode");

const validateAddressStreet: ValidateAddresses = (addresses) =>
    addresses.addresses.every(address => 'street' in address)
        ? E.right(addresses)
        : E.left("Missing property: street");

const validateAll: ValidateAddresses = (addresses) =>
    pipe(
        addresses,
        E.of,
        E.chain(validateAnAddressExists),
        E.chain(validateAddressPostcode),
        E.chain(validateAddressStreet),
    );

// Here is a generic validation for any high level prop on addresses
const validateAddressesProp = (prop: string) => (addresses: MyMap): Either<string, MyMap> =>
    addresses.addresses.every(address => prop in address)
        ? E.right(addresses)
        : E.left(`Missing property: ${prop}`);



const validateAllPipe: ValidateAddresses = (addresses) =>
    pipe(
        addresses,
        E.of,
        E.chain(validateAnAddressExists),
        E.chain(validateAddressesProp('postcode')),
        E.chain(validateAddressesProp('street')),
    );


const validateAllFlow: ValidateAddresses = flow(
    E.of,
    E.chain(validateAnAddressExists),
    E.chain(validateAddressesProp('postcode')),
    E.chain(validateAddressesProp('street')),
);

console.log('-----------------');

(async () => {
    pipe(
        brokenObj,
        validateAll,
        E.bimap(console.log, console.log),
    );

    pipe(
        TE.tryCatch(
            mockGetAddresses,
            (reason) => `async call to getAddresses failed: ${reason}`,
        ),
        TE.chain(x => TE.fromEither(validateAll(x))),
        TE.bimap(console.log, console.log)
    )();

    // How to use Eithers in a TaskEither context
    const val = await pipe(
        TE.tryCatch(
            mockGetAddresses,
            (reason) => `async call to getAddresses failed: ${reason}`,
        ),
        TE.chain(flow(
            validateAnAddressExists,
            E.chain(validateAddressesProp('postcode')),
            E.chain(validateAddressesProp('street')),
            TE.fromEither,
        )),
        TE.bimap(
            x => {
                console.log('Error', x);
                return x;
            },
            x => {
                console.log('Success', x);
                return x;
            }
        ),
        TE.getOrElseW(T.of),
    )();

    console.log(`val is : ${(val as MyMap).addresses[0].postcode}`);
})();



