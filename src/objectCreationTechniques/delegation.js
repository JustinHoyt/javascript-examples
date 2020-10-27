const Animal = {
  init(name, energy) {
    this.name = name;
    this.energy = energy;
  },

  eat(amount) {
    console.log(`${this.name} is eating.`);
    this.energy += amount;
  },

  sleep(length) {
    console.log(`${this.name} is sleeping.`);
    this.energy += length;
  },

  play(length) {
    console.log(`${this.name} is playing.`);
    this.energy -= length;
  },
};

const anAnimal = Object.create(Animal);
anAnimal.init('steve', 10);
anAnimal.play(2);
console.log(anAnimal.energy);

const Dog = Object.create(Animal);

Dog.setup = function setup(name, energy, breed) {
  this.init(name, energy);
  this.breed = breed;
};

Dog.bark = function bark() {
  console.log('woof');
  this.energy -= 0.1;
};

const aDog = Object.create(Dog);
aDog.setup('steve', 10, 'corgi');
aDog.play(2);
aDog.bark();
console.log(aDog.energy);

module.exports = {};
