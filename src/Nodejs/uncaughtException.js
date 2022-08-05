export default (client, error) => {
	console.log('uncaughtException', error);
	client.nyan.app.io.emit('error', `\nuncaughtException: ${error.message}`);
};