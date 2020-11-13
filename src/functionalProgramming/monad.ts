/* eslint-disable no-multiple-empty-lines */
/// <reference path="../../types/node.d.ts"/>
import * as R from 'ramda';

import Maybe from './DataTypes/Maybe';
import { pipeK } from 'crocks';

type id = string | number;

const log = (prefix: string) => (x) => console.log(prefix, x);

const safeProp = (prop: id) => (obj: object): maybe<unknown> => Maybe.of(obj[prop]);

const safeHead = safeProp(0);

const firstAddressStreet = R.pipe(
  safeProp('addresses'),
  // @ts-ignore
  R.map(safeHead),
  R.map(R.map(safeProp('street'))),
  R.map(R.map(R.map(R.tap(log('mapping: '))))),
) as unknown as (obj) => maybe<string>;

// that's a lot of maps!

firstAddressStreet({
  addresses: [{ street: { name: 'Mulburry', number: 8402 }, postcode: 'WC2N' }],
});
// Maybe(Maybe(Maybe({name: 'Mulburry', number: 8402})))





//joins can fix this
const join = (m) => m.join();

const firstAddressStreetWithJoin: (obj) => maybe<any>[] = R.pipe(
  safeProp('addresses'),
  // @ts-ignore
  R.map(safeHead),
  join,
  R.map(safeProp('street')),
  join,
  R.map(R.tap(log('map and join: '))),
);

firstAddressStreetWithJoin({
  addresses: [{ street: { name: 'Mulburry', number: 8402 }, postcode: 'WC2N' }],
});





// join feels repetitive. chain can fix this
const firstAddressStreetWithChain = R.pipe(
  safeProp('addresses'),
  //@ts-ignore
  R.chain(safeHead),
  //@ts-ignore
  R.chain(safeProp('street')),
  R.map(R.tap(log('chain: '))),
) as unknown as (obj) => maybe<string>;

firstAddressStreetWithChain({
  addresses: [{ street: { name: 'Mulburry', number: 8402 }, postcode: 'WC2N' }],
});





/**
 * we're writing 'chain' a lot now. can we abstract that away? Kleisli to the
 * rescue!
 *
 * While a regular category models composition of functions, a Kleisli
 * category models “composition of effects,” or “composition of monads.” This
 * category has all of the same objects your initial category had, but instead
 * of our simple f :: A -> B maps, we need f :: A -> m B where m is the monadic
 * type providing the abstraction we need and, by definition, implements chain.
 * In lieu of raising the abstraction, instead of R.compose, we need a
 * higher-level composition as well, smart enough to chain those monads or
 * containers seamlessly, called composeK (for Kleisli, of course). composeK has
 * the following form, taking 3 Kleisli functions:
 *
 * R.composeK(h, g, f) = R.compose(R.chain(h), R.chain(g), R.chain(f))
 *
 * Compose is just pipe but reading right to left.
 * Here we are doing pipe over compose for easier left to right reading
 */
const firstAddressStreetWithComposeK: (obj) => maybe<string> = pipeK(
  safeProp('addresses'),
  safeHead,
  safeProp('street'),
  R.tap(log('composeK: ')),
);

firstAddressStreetWithComposeK({
  addresses: [{ street: { name: 'Mulburry', number: 8402 }, postcode: 'WC2N' }],
});
