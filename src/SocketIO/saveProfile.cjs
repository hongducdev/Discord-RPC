module.exports = async (client, msg) => {
	console.log(msg);
	if(!msg.profile) msg = Object.assign(client.eval(false, `data_`), msg);
	client.eval(false, `loadFile(true, JSON.parse('${JSON.stringify(msg)}'))`);
	client.nyan.app.io.emit('saveProfile');
};
