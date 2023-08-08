interface LogOptions {
	devOnly?: boolean;
}

type LogFunctions = Console["info"] | Console["warn"] | Console["error"];

function _log(fn: LogFunctions, msg: string, options?: LogOptions) {
	if (options?.devOnly) {
		if (process.env.NODE_ENV !== "production") fn(msg);
	} else {
		fn(msg);
	}
}

export function info(msg: string, options?: LogOptions) {
	_log(console.info, msg, options);
}

export function warn(msg: string, options?: LogOptions) {
	_log(console.warn, msg, options);
}

export function error(msg: string, options?: LogOptions) {
	_log(console.error, msg, options);
}

export default { info, warn, error };
