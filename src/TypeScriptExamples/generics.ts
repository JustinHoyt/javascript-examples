declare global {
    interface Array<T> {
        filterWith<TKey extends keyof T, TValue extends T[TKey]> (member: TKey, value: TValue): T[];
    }
}

Array.prototype.filterWith = function <T, TKey extends keyof T, TValue extends T[TKey]>(
    this: T[], member: TKey, value: TValue
) {
    return this.filter(x => x[member] === value);
}



export default {}
