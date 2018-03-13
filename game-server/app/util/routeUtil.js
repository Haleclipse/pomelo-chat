var exp = module.exports;
var dispatcher = require('./dispatcher');

exp.chat = function(session, msg, app, cb) {
    console.log("Chat routing called.");
    var chatServers = app.getServersByType('chat');
    if (!chatServers || chatServers.length === 0) {
        cb(new Error('Can\'t find chat servers.'));
        return;
    }

    var selectedServer = dispatcher.dispatch(session.get('rid'), chatServers);

    cb(null, selectedServer.id);
}