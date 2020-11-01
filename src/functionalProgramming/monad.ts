/* eslint-disable no-multiple-empty-lines */
/// <reference path="../../types/node.d.ts"/>
import * as R from 'ramda';
import { composeK } from 'crocks/helpers';
import Maybe from './DataTypes/Maybe';

type id = string | number;
type maybe = Maybe | any;

const log = (prefix: string) => (x) => console.log(prefix, x);
Maybe.of({'hello':'world'});
const safeProp = (prop: id) => (obj): maybe => Maybe.of(obj[prop]);

const safeHead = safeProp(0);

const firstAddressStreet: (obj) => maybe = R.compose(
  R.map(R.map(R.map(R.tap(log('mapping: '))))),
  R.map(R.map(safeProp('street'))),
  R.map(safeHead),
  safeProp('addresses'),
);


// that's a lot of maps!

firstAddressStreet({
  addresses: [{ street: { name: 'Mulburry', number: 8402 }, postcode: 'WC2N' }],
});
// Maybe(Maybe(Maybe({name: 'Mulburry', number: 8402})))





//joins can fix this
const join = (m) => m.join();

const firstAddressStreetWithJoin: (obj) => maybe = R.compose(
  R.map(R.tap(log('map and join: '))),
  join,
  R.map(safeProp('street')),
  join,
  R.map(safeHead),
  safeProp('addresses'),
);

firstAddressStreetWithJoin({
  addresses: [{ street: { name: 'Mulburry', number: 8402 }, postcode: 'WC2N' }],
});





// join feels repetitive. chain can fix this
const firstAddressStreetWithChain: (obj) => maybe = R.compose(
  R.map(R.tap(log('chain: '))),
  R.chain(safeProp('street')),
  R.chain(safeHead),
  safeProp('addresses'),
);

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
 */
const firstAddressStreetWithComposeK: (obj) => maybe = composeK(
  R.tap(log('composeK: ')),
  safeProp('street'),
  safeHead,
  safeProp('addresses'),
);

firstAddressStreetWithComposeK({
  addresses: [{ street: { name: 'Mulburry', number: 8402 }, postcode: 'WC2N' }],
});
