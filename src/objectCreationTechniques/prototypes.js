function Animal(name, energy) {
  this.name = name;
  this.energy = energy;
}

Animal.prototype.eat = function eat(amount) {
  console.log(`${this.name} is eating.`);
  this.energy += amount;
};

Animal.prototype.sleep = function sleep(length) {
  console.log(`${this.name} is sleeping.`);
  this.energy += length;
};

Animal.prototype.play = function play(length) {
  console.log(`${this.name} is playing.`);
  this.energy -= length;
};

const anAnimal = new Animal('steve', 10);
anAnimal.play(2);
console.log(anAnimal.energy);

function Dog(name, energy, breed) {
  Animal.call(this, name, energy);
  this.breed = breed;
}

Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function bark() {
  console.log('woof');
  this.energy -= 0.1;
};

const aDog = new Dog('steve', 10, 'corgi');
aDog.play(2);
aDog.bark();
console.log(aDog.energy);

module.exports = {};
