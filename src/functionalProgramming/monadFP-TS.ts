import * as O from 'fp-ts/lib/Option';

import { Option } from 'fp-ts/lib/Option';
import { flow } from 'fp-ts/lib/function';

const optionalProp = <T, P extends keyof T>(prop: P) => (obj: T): O.Option<T[P]> => O.of(obj[prop]);

interface MyMap {
  addresses: [
    {
      street: { name: string, number: number },
      postcode: string,
    }
  ]
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
