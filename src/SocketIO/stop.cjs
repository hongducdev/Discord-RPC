module.exports = async (client, msg) => {
	console.log(msg);
	//
	if (msg.mode == 1) {
		// RPC Apps
		await client.nyan.client.clearActivity();
		client.nyan.app.io.emit('stop');
	} else {
		client.nyan.client.user.setPresence({
			activities: [],
		});
		client.nyan.app.io.emit('stop');
	}
};
