const IO = require('crocks/IO');
const Async = require('crocks/Async');
const R = require('ramda');

const ifElse = require('crocks/logic/ifElse')
const isNumber = require('crocks/predicates/isNumber')
const nAry = require('crocks/helpers/nAry')

const { fromPromise } = Async;

(async () => {
    try {
        // log :: String -> a -> a
        const log = label => x =>
            (console.log(`${label}:`, x), x)

        // safeProm :: ((a -> Boolean), a) -> Promise a a
        const safeProm = (pred, x) => new Promise(
            (res, rej) => ifElse(pred, res, rej, x)
        )

        // safeProm(isNumber, 34)
        //     .then(log('resProm'))
        // //=> resProm: 34

        // safeProm(isNumber, '34')
        //     .catch(log('rejProm'))
        // //=> rejProm: "34"

        // safeAsync :: (a -> Boolean) -> a -> Async a a
        const safeAsync =
            nAry(2, fromPromise(safeProm))

        // numAsync :: a -> Async a Number
        const numAsync =
            safeAsync(isNumber)

        const getResult = async () => await numAsync(35)
            .toPromise()
            .then((result) => result)
            .catch(log('rej'));

        const ans = await getResult();
        console.log(ans)
        //=> res: 34
        console.log('done');
        // numAsync('34')
        //     .fork(log('rej'), log('res'))
        // //=> rej: "34"
    } catch (e) {
        // Deal with the fact the chain failed
    }
})();
