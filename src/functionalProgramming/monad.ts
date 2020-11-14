/* eslint-disable no-multiple-empty-lines */
/// <reference path="../../types/node.d.ts"/>
import * as R from 'ramda';

import { Functor } from 'ramda';
import Maybe from './DataTypes/Maybe';
import { chain } from 'lodash';
import { maybe } from 'purifree-ts';
import { pipeK } from 'crocks';

type id = string | number;

const log = (prefix: string) => (x) => console.log(prefix, x);

// export function map<T, U>(fn: (x: T) => U): (list: readonly T[]) => U[];
const safeProp = (prop: id) => (obj: object): Functor<unknown> => Maybe.of(obj[prop]);

const safeHead = safeProp(0);

const map = (fn: Function) => <T>(obj): T => obj.map(fn);

const firstAddressStreet = R.pipe(
  safeProp('addresses'),
  map(safeHead),
  map(R.map(safeProp('street'))),
  map(R.map(R.map(R.tap(log('mapping: '))))),
);

// that's a lot of maps!

firstAddressStreet({
  addresses: [{ street: { name: 'Mulburry', number: 8402 }, postcode: 'WC2N' }],
});
// Maybe(Maybe(Maybe({name: 'Mulburry', number: 8402})))





//joins can fix this
const join = (m) => m.join();

const firstAddressStreetWithJoin: (obj) => Functor<unknown> = R.pipe(
  safeProp('addresses'),
  R.map(safeHead),
  join,
  R.map(safeProp('street')),
  join,
  R.map(R.tap(log('map and join: '))),
);

firstAddressStreetWithJoin({
  addresses: [{ street: { name: 'Mulburry', number: 8402 }, postcode: 'WC2N' }],
});


const result = R.pipe<number[], string[], number[], string[]>(
  R.map(String),
  R.map(Number),
  R.map(String),
)([1,2,3,4])




// join feels repetitive. chain can fix this
const firstAddressStreetWithChain = R.pipe(
  safeProp('addresses'),
  // @ts-ignore
  R.chain(safeHead),
  // @ts-ignore
  R.chain(safeProp('street')),
  R.map(R.tap(log('chain: '))),
);

// @ts-ignore
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
const firstAddressStreetWithComposeK = pipeK(
  safeProp('addresses'),
  safeHead,
  safeProp('street'),
  R.tap(log('composeK: ')),
);

firstAddressStreetWithComposeK({
  addresses: [{ street: { name: 'Mulburry', number: 8402 }, postcode: 'WC2N' }],
});
