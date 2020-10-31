interface Monad {
  join: Function;
  map: Function;
  chain: Function;
  ap: Function;
  of: Function;
}

interface Maybe extends Monad {}
