module.exports = (client, msg) => {
	client.nyan.client.destroy();
	client.nyan.refresh();
	client.nyan.app.io.emit('logout');
};
