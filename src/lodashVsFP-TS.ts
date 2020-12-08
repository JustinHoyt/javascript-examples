import * as A from 'fp-ts/Array';
import * as O from 'fp-ts/Option';
import * as _ from 'lodash';

import { ord, ordNumber } from 'fp-ts/lib/Ord';

import { pipe } from 'fp-ts/lib/function';

interface User {
  user: string,
  age: number,
}

const users: User[] = [
  { user: 'barney', age: 36 },
  { user: 'fred', age: 40 },
  { user: 'pebbles', age: 1 },
];

const youngest = _.chain(users)
  .sortBy('age')
  .map((o) => `${o.user} is ${o.age}`)
  .head()
  .value();

console.log(youngest);

const byAge = ord.contramap(ordNumber, (p: User) => p.age);

const youngest2 = pipe(
  O.fromNullable(users),
  O.map(A.sortBy([byAge])),
  O.map(A.map((o) => `${o.user} is ${o.age}`)),
  O.map(A.head),
);

console.log(youngest2);
