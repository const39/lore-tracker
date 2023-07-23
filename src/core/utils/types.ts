/**
 * App version generated during the build phase.
 */
// @ts-ignore: Ignore typing because APP_VERSION is injected by Vite during the build phase.
export const VERSION = APP_VERSION;

export type UUID = string;

export type UnionOfTupleValues<T extends Readonly<string[] | number[] | symbol[]>> = T[number];

export type Constructor<T> = new (...args: any[]) => T;

export type Maybe<T = unknown> = T | null | undefined;

/**
 * Make the specified properties in T optional.
 */
export type Optional<T, TOptional extends keyof T> = Required<Omit<T, TOptional>> &
	Partial<Pick<T, TOptional>>;

/**
 * Make all properties in T optional except for the specified ones.
 */
export type OptionalExceptFor<T, TRequired extends keyof T> = Partial<
	Pick<T, Exclude<keyof T, TRequired>>
> &
	Required<Pick<T, TRequired>>;
