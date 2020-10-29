class Sum {
  get isNothing() {
    return this.$value === null || this.$value === undefined;
  }

  constructor(x) {
    this.$value = x;
  }

  static empty() {
    return Sum.of(0);
  }

  concat(y) {
    return y.map((val) => val + this.$value);
    // return Sum.of(this.$value + y);
  }

  // ----- Pointed Sum
  static of(x) {
    return new Sum(x);
  }

  // ----- Functor Sum
  map(fn) {
    return this.isNothing ? this : Sum.of(fn(this.$value));
  }

  // ----- Applicative Sum
  ap(f) {
    return this.isNothing ? this : f.map(this.$value);
  }

  // ----- Monad Sum
  chain(fn) {
    return this.map(fn).join();
  }

  join() {
    return this.isNothing ? this : this.$value;
  }

  // ----- Traversable Sum
  sequence(of) {
    return this.traverse(of, R.identity);
  }

  traverse(of, fn) {
    return this.isNothing ? of(this) : fn(this.$value).map(Sum.of);
  }
}

module.exports = Sum;
