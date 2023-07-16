import process from 'process';
import { Snowflake } from './interface';

function pid() {
	if (typeof process !== 'undefined') {
		return process.pid;
	}
	return null;
}

const uuid4122 = (): string =>
	// @ts-ignore
	([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (a) =>
		(a ^ ((Math.random() * 16) >> (a / 4))).toString(16),
	);

export { pid, uuid4122 };

export default {
	pid,
	uuid4122,
};
