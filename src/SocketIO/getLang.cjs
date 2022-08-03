module.exports = (client, msg) => {
	client.nyan.app.io.emit('getLang', client.eval(false, `data_.language`));
};