function Animal(spec) {
  let { energy } = spec;
  const { name } = spec;

  const eat = (amount) => {
    console.log(`${name} is eating.`);
    energy += amount;
  };
  const sleep = (length) => {
    console.log(`${name} is sleeping.`);
    energy += length;
  };
  const play = (length) => {
    console.log(`${name} is playing.`);
    energy -= length;
  };
  const getEnergy = () => energy;
  const setEnergy = (newEnergy) => { energy = newEnergy; };
  const getName = () => name;

  return {
    getName, getEnergy, setEnergy, eat, sleep, play,
  };
}

const anAnimal = Animal({ name: 'steve', energy: 10 });
anAnimal.play(2);
console.log(anAnimal.getEnergy());

/**
 * @param {{ name: string; energy: number; breed: string; }} spec
 */
function Dog(spec) {
  const { breed } = spec;
  const animalInfo = Animal(spec);
  const { setEnergy, getEnergy } = animalInfo;

  const bark = () => {
    console.log('woof');
    setEnergy(getEnergy() - 0.1);
  };

  return {
    ...animalInfo,
    breed,
    bark,
  };
}

const aDog = Dog({ name: 'steve', energy: 10, breed: 'corgi' });
aDog.play(2);
aDog.bark();
console.log(aDog.getEnergy());

module.exports = {};
