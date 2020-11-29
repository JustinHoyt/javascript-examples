import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';

import { pipe } from 'fp-ts/lib/function';

const isNumber = (value: string) => (parseInt(value, 10) ? E.right(parseInt(value, 10)) : E.left('not a number'));
const isPositive = (value: number) => (value >= 0 ? E.right(value) : E.left('not a positive integer'));

type AddTask = (number1: Promise<string>, number2: Promise<string>) =>
  TE.TaskEither<string, number>;
const addPositiveAsyncExample: AddTask = (number1, number2) => {
  const taskEither1 = TE.tryCatch(() => number1, () => 'failed promise');
  const taskEither2 = TE.tryCatch(() => number2, () => 'failed promise');

  const validate = (value: string) => pipe(value, isNumber, E.chain(isPositive));

  const add = (num1: number) => (num2: number) => num1 + num2;

  const validateTask = (taskEither: TE.TaskEither<string, string>) => pipe(
    taskEither,
    TE.chain((s) => TE.fromEither(validate(s))),
  );

  const addTwoTasks = (
    task1: TE.TaskEither<string, number>,
    task2: TE.TaskEither<string, number>,
  ) => pipe(TE.of(add), TE.ap(task1), TE.ap(task2));

  return addTwoTasks(validateTask(taskEither1), validateTask(taskEither2));
};

function getAddition() {
  return addPositiveAsyncExample(Promise.resolve('2'), Promise.resolve('3'))()
    .then(E.fold((e) => e.toString(), (result) => result.toString()));
}

getAddition().then(console.log);
