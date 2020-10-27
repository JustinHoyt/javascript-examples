/* eslint-disable max-classes-per-file */
class Animal {
  constructor(name, energy) {
    this.name = name;
    this.energy = energy;
  }

  eat(amount) {
    console.log(`${this.name} is eating.`);
    this.energy += amount;
  }

  sleep(length) {
    console.log(`${this.name} is sleeping.`);
    this.energy += length;
  }

  play(length) {
    console.log(`${this.name} is playing.`);
    this.energy -= length;
  }
}

const anAnimal = new Animal('steve', 10);
anAnimal.play(2);
console.log(anAnimal.energy);

class Dog extends Animal {
  constructor(name, energy, breed) {
    super(name, energy);
    this.breed = breed;
  }

  bark() {
    console.log('woof');
    this.energy -= 0.1;
  }
}

const aDog = new Dog('steve', 10, 'corgi');
aDog.play(2);
aDog.bark();
console.log(aDog.energy);

module.exports = {};
