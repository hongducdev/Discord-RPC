const { RichPresence } = require('discord.js-selfbot-v13');
module.exports = async (client, msg) => {
	console.log(msg);
    /**
     * @type {RichPresence}
     */
    const rpc = new RichPresence({}, undefined, msg.mode === 1);
    rpc.setApplicationId(msg.data.application_id)
    if (msg.data.details) rpc.setDetails(msg.data.details);
    if (msg.data.state) rpc.setState(msg.data.state);
    if (msg.data.assets.large_image) rpc.setAssetsLargeImage(msg.data.assets.large_image);
    if (msg.data.assets.large_text) rpc.setAssetsLargeText(msg.data.assets.large_text);
    if (msg.data.assets.small_image) rpc.setAssetsSmallImage(msg.data.assets.small_image);
    if (msg.data.assets.small_text) rpc.setAssetsSmallText(msg.data.assets.small_text);
    if (msg.data.timestamps) rpc.setStartTimestamp(msg.data.timestamps);
    if (
		parseInt(msg.data.party?.min) &&
		parseInt(msg.data.party?.max) &&
		parseInt(msg.data.party?.min) <= parseInt(msg.data.party?.max)
	)
		rpc.setParty({
			max: parseInt(msg.data.party?.max),
			current: parseInt(msg.data.party?.min),
			id: rpc.getUUID(),
		});
    if (msg.data.name) rpc.setName(msg.data.name);
    if (msg.data.buttons[0].text && msg.data.buttons[0].url) rpc.addButton(msg.data.buttons[0].text, msg.data.buttons[0].url);
    if (msg.data.buttons[1].text && msg.data.buttons[1].url) rpc.addButton(msg.data.buttons[1].text, msg.data.buttons[1].url);
	//
    console.log(rpc, rpc.ipc, rpc.toJSON());
	if (rpc.ipc) {
		// RPC Apps
        const res = await client.nyan.client.request('SET_ACTIVITY', {
			pid: process.pid,
			activity: rpc.toJSON(),
		});
		client.nyan.app.io.emit('update', res);
	} else {
		client.nyan.client.user.setActivity(rpc.toJSON());
        client.nyan.app.io.emit('update', rpc.toJSON());
	}
};
