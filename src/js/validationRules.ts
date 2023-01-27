export default {
	required: (msg: string) => (v: string) => !!v || msg,
	counter: (msg: string, count: number) => (v: string) => v.length <= count || msg,
	numberInRange: (msg: string, start: number, stop?: number) => (v: string) => {
		const val = Number(v);
		let predicate = undefined;
		if (stop !== undefined) predicate = val >= start && val < stop;
		else predicate = val >= start;

		return (Number.isSafeInteger(val) && predicate) || msg;
	},
	hex: (msg: string) => (v: string) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v) || msg,
};
