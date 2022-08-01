module.exports = async (client, msg) => {
	console.log(msg);
	client.eval(false, `loadFile(true, JSON.parse('${JSON.stringify(msg)}'))`);
	client.nyan.app.io.emit('saveProfile');
};
