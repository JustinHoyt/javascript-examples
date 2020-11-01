class Maybe implements monad {
  $value: unknown;

  get isNothing() {
    return this.$value === null || this.$value === undefined;
  }

  get isJust() {
    return !this.isNothing;
  }

  constructor(x) {
    this.$value = x;
  }

  // ----- Pointed Maybe
  static of(x) {
    return new Maybe(x);
  }

  // ----- Functor Maybe
  map(fn) {
    return this.isNothing ? this : Maybe.of(fn(this.$value));
  }

  // ----- Applicative Maybe
  ap(f) {
    return this.isNothing ? this : f.map(this.$value);
  }

  // ----- Monad Maybe
  chain(fn) {
    return this.map(fn).join();
  }

  join() {
    return this.isNothing ? this : this.$value;
  }

  traverse(of, fn) {
    return this.isNothing ? of(this) : fn(this.$value).map(Maybe.of);
  }
}

export default Maybe;
