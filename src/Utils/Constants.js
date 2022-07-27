function keyMirror(arr) {
	const tmp = Object.create(null);
	for (const value of arr) tmp[value] = value;
	return tmp;
}

function createEnum(keys) {
	const obj = {};
	for (const [index, key] of keys.entries()) {
		if (key === null) continue;
		obj[key] = index;
		obj[index] = key;
	}
	return obj;
}