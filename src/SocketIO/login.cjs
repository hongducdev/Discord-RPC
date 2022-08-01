module.exports = (client, msg) => {
	console.log(msg);
    //
    if (msg.mode == 1) {
        // RPC Apps
        client.nyan._rpcClient
			.login({ clientId: msg.id })
			.then(() => {
                client.nyan.client = client.nyan._rpcClient;
				client.nyan.app.io.emit('login', client.nyan.client.user);
            })
			.catch((e) => {
                client.nyan.refresh();
				client.nyan.app.io.emit('error', e.message);
			});
    } else {
        // Selfbot
        client.nyan._selfClient
            .login(msg.id)
            .then(() => {
                client.nyan.client = client.nyan._selfClient;
                client.nyan.app.io.emit('login', client.nyan.client.user);
            })
            .catch((e) => {
                client.nyan.refresh();
                client.nyan.app.io.emit('error', e.message);
            });
    }
};
