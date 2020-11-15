import * as O from 'fp-ts/lib/Option';
/* eslint-disable no-multiple-empty-lines */
/// <reference path="../../types/node.d.ts"/>
import * as R from 'ramda';

import { chain, map, option } from 'fp-ts';
import { flow, pipe } from 'fp-ts/lib/function';

const log = (prefix: string) => (x) => console.log(prefix, x);

const obj = {
  addresses: [{ street: { name: 'Mulburry', number: 8402 }, postcode: 'WC2N' }],
}

const getAddress = flow(
  O.fromNullable,
  O.map((object) => object['addresses']),
);

const getAddressResult = getAddress({
  addresses: [{ street: { name: 'Mulburry', number: 8402 }, postcode: 'WC2N' }],
});

O.fold(() => console.log('failed'), log('succeeded: '))(getAddressResult);

const street = pipe(O.of({
  addresses: [{ street: { name: 'Mulburry', number: 8402 }, postcode: 'WC2N' }],
}),
  O.bindTo('object'),
  O.bind('addresses', ({object}) => O.of(object.addresses)),
  O.bind('firstAdress', ({addresses}) => O.of(addresses[0])),
  O.bind('street', ({firstAdress}) => O.of(firstAdress.street)),
  O.fold(() => undefined, ({street}) => street)
);

console.log(getAddressResult);
console.log(street);
