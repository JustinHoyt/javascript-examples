interface monad {
  join: Function;
  map: Function;
  chain: Function;
  ap: Function;
}

interface maybe extends monad {}
