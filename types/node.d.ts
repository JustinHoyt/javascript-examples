interface monad<T> {
  join: Function;
  map: Function;
  chain: Function;
  ap: Function;
}

interface maybe<T> extends monad<T> {}