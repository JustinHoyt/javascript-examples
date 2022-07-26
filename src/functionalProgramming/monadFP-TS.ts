import * as O from 'fp-ts/lib/Option';
import * as E from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import * as T from 'fp-ts/lib/Task';
import * as A from 'fp-ts/lib/Array';

import { tap } from 'fp-ts-std/IO'
import { Option } from 'fp-ts/lib/Option';
import { Either } from 'fp-ts/lib/Either';
import { flow, pipe, identity } from 'fp-ts/lib/function';

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


// Currying is the transformation of a function with multiple arguments into a sequence of single-argument functions
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



// OptionaProp is functionally similar to the elvis operator (?.) in JavaScript.
// Lets use OptionalProp as an example of how to work with monads.
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

// chain is a map and join combined, keeping monads of the same type from nesting.
type GetProp = (object: MyMap) => Option<unknown>;
const getAddressChaining: GetProp = flow(
  O.fromNullable,
  O.chain(optionalProp('addresses')),
  O.chain(optionalProp(0)),
  O.chain(optionalProp('street')),
  O.fold(() => undefined, (street) => log('chain: ')(street)),
);
getAddressChaining(obj);
// The typing is limited when understanding how to operate over the values in
// the monads as they move through the flow operator because they can lose
// context of previous computed values. For sitations like that use the bind
// syntax, similar in concept to the Do syntax in Haskell

// do/bind syntax is more flexible than chain because we can bind variables to
// the context of the `do` as it goes through the actions.
const getAddressBinding: (object: MyMap) => Option<string> = flow(O.fromNullable,
  O.bindTo('object'),
  O.bind('addresses', ({ object }) => O.of(object.addresses)),
  O.bind('firstAdress', ({ addresses }) => O.of(addresses[0])),
  O.bind('street', ({ firstAdress }) => O.of(firstAdress.street)),
  O.fold(() => undefined, ({ street }) => log('do: ')(street)));

getAddressBinding(obj);


// Why use Eithers
//
// Eithers are essential for capturing error states in functional programming.
// We need the Eithers because we cannot break pipelines by throwing errors.
// Error states must either be handled or propagated up the call stack.
//
// Eithers are also advantageous to their try-catch-finally counterparts
// because the error is always type-safe. When you use a catch block, the error
// is always of type unknown. This is inconvenient for you as the client
// because you need to use instanceof to narrow down the error type. Even worse
// is when you are forced to define your own custom type guards to do the same
// thing.
//
// With Eithers, we know every possible error state based on the type
// signature. We can choose to handle them in a switch statement or continue to
// propagate up the call stack.

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

const validateAddressPostcode: ValidateAddresses = (addresses) =>
    addresses.addresses.every(address => 'postcode' in address)
        ? E.right(addresses)
        : E.left("Missing property: postcode");

const validateAddressStreet: ValidateAddresses = (addresses) =>
    addresses.addresses.every(address => 'street' in address)
        ? E.right(addresses)
        : E.left("Missing property: street");

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

const validateAll: ValidateAddresses = flow(
    E.of,
    E.chain(validateAnAddressExists),
    E.chain(validateAddressesProp('postcode')),
    E.chain(validateAddressesProp('street')),
);

const validateAllAsync = (x: MyMap) => TE.fromEither(validateAll(x));

console.log('-----------------');

(async () => {
    pipe(
        obj,
        validateAll,
        E.bimap(console.log, console.log),
    );
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
        TE.bimap(x => {
            console.log('heloooooo', x);
            return x;
        },
        x => {
            console.log('heloooooo', x);
            return x;
        }),
        TE.getOrElseW(T.of),
    )();

    console.log(`val is : ${(val as MyMap).addresses[0].postcode}`);
})();

/* Notes
 * Try to make a small CL in the codebase as an example.
 *
 */


// pipe(
//     2,
//     add2,
//     addC(3),
//     console.log,
// )
//
// flow(
//     add2,
//     addC(3),
//     console.log,
// )(2)

