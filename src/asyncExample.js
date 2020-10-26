const Async = require('crocks/Async');

const ifElse = require('crocks/logic/ifElse');
const isNumber = require('crocks/predicates/isNumber');
const nAry = require('crocks/helpers/nAry');

const { fromPromise } = Async;

(async () => {
  // log :: String -> a -> a
  const log = (label) => (x) => console.log(`${label}:`, x);

  // safeProm :: ((a -> Boolean), a) -> Promise a a
  const safeProm = (pred, x) => new Promise(
    (res, rej) => ifElse(pred, res, rej, x),
  );

  // safeAsync :: (a -> Boolean) -> a -> Async a a
  const safeAsync = nAry(2, fromPromise(safeProm));

  // numAsync :: a -> Async a Number
  const numAsync = safeAsync(isNumber);

  const getResult = async () => numAsync(35)
    .toPromise()
    .then((result) => result)
    .catch(log('rej'));

  const ans = await getResult();
  console.log(ans);
  //= > res: 34
  console.log('done');
})();
