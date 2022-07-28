module.exports = (client, msg) => {
    client.nyan.app.io.emit('ready', 'ok');
    console.log('emit ready ws');
}