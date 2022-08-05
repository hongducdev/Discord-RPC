export default (client, error) => {
	console.error('unhandledRejection', error);
	client.nyan.app.io.emit('error', `\nunhandledRejection: ${error.message}`);
};