type ReportItem = {
    amount: number;
    hasReceipt: boolean;
    type: 'accounting' | 'sales';
    date: Date;
    description: string;
}

// what if we wanted to make this type consist of all optional types?
type OptionalReportItem = {
    [K in keyof ReportItem]?: ReportItem[K]
}

// let's make this type generic
type Optional<T> = {
    [K in keyof T]?: T[K]
}
const optionalReportItem: Optional<ReportItem> = {};

// this is actually built into TS as the Partial type!
const partialReportItem: Partial<ReportItem> = {};

/**
 * ===== some other built in mapped types are =====
 */

// Readonly makes all properties non-assignable
type ReadonlyReportItem = Readonly<ReportItem>;
const readOnlyReportItem: Partial<ReadonlyReportItem> = {amount: 2};
/**
 * this is unallowed now:
 * readOnlyReportItem.amount = 4;
 */

// Pick lets you make a new type from a subset of the original type
type PickReportItem = Pick<ReportItem, 'date' | 'amount' | 'description'>;

const pickReportItem: PickReportItem = {
    date: new Date(),
    amount: 10,
    description: 'hello world'
};

