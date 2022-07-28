module.exports = (client, msg) => {
	client.nyan.app.io.emit('saveData', client.eval(false, `data_`));
};