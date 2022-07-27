/*
 * We import the Monads as objects and use maps/chains/folds from that monads's lib.
 * This is due to a limitation in TypeScript's type system.
 */
import * as E from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';

import { Either } from 'fp-ts/lib/Either';
import { flow, pipe } from 'fp-ts/lib/function';

const enum ErrorType {
  ValidationError,
  PropertyNotFoundError,
}


interface AppError extends Error {
  _tag: ErrorType
  message: string
}

/*
 * These are error classes we can use for more sophisticated error handling
 */
class ValidationError extends Error {
    _tag: ErrorType.ValidationError;

    constructor(m: string) {
        super(`Validation error ${m}`);

        this._tag = ErrorType.ValidationError;
    }

    public static of(message: string): ValidationError {
        return new ValidationError(message);
    }

}

class PropertyNotFoundError extends Error {
    _tag: ErrorType.PropertyNotFoundError;

    constructor(m: string) {
        super(`PropertyNotFoundError error ${m}`);

        this._tag = ErrorType.PropertyNotFoundError;
    }

    public static of(message: string): PropertyNotFoundError {
        return new PropertyNotFoundError(message);
    }
}

interface MyMap {
  addresses: [ Address ]
}

interface Address {
  street?: { name: string, number: number },
  postcode?: string,
}

const obj: MyMap = {
  addresses: [
    {
      street: { name: 'Mulburry', number: 8402 },
      postcode: 'WC2N',
    },
  ],
};

const brokenObj: MyMap = {
  addresses: [
    {
      street: { name: 'Mulburry', number: 8402 },
    },
  ],
};

/*
 * Using Error objects we can create typed error based on why the failure happens
 */
type ValidateAddresses = (addresses: MyMap) => Either<Error, MyMap>;

const validateAnAddressExists: ValidateAddresses = (addresses) =>
    addresses?.addresses.length > 0
        ? E.right(addresses)
        : E.left(new Error("No addresses exist"));

const validateAddressesProp = (prop: string) => (addresses: MyMap): Either<Error, MyMap> =>
    addresses.addresses.every(address => prop in address)
        ? E.right(addresses)
        : E.left(new ValidationError(`Missing property: ${prop}`));

const validateAll: ValidateAddresses = flow(
    E.of,
    E.chain(validateAnAddressExists),            // May throw a PropertyNotFoundError
    E.chain(validateAddressesProp('postcode')),  // May throw a ValidationError
    E.chain(validateAddressesProp('street')),    // May throw a ValidationError
);

const validateAllAsync = (x: MyMap) => TE.fromEither(validateAll(x));


const handlePropertyNotFoundError = () => console.log('handling missing property');
const handleValidationError = () => console.log('handling validation error');

const handleAppErrors = (error: AppError) => {
    switch(error._tag) {
        case ErrorType.PropertyNotFoundError:
            handlePropertyNotFoundError();
            return error.message;
        case ErrorType.ValidationError:
            handleValidationError();
            return error.message;
        default:
            return `Unknown error: ${error.message}`
    }
}

(async () => {
    pipe(
        brokenObj,
        validateAll,
        E.bimap(
            flow(handleAppErrors, console.error),
            console.log
        ),
    );
})();




