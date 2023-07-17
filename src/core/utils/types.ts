export type UnionOfTupleValues<T extends Readonly<string[] | number[] | symbol[]>> = T[number];

export type Constructor<T> = new (...args: any[]) => T;

export type UUID = string;
