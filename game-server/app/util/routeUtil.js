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
};

// 路由函数的参数routeParam就是rpc调用时的第一个参数，msg中封装了rpc调用的详细信息，包括namespace，servertype，等等。context是rpc客户端的上下文，一般由全局的application充当,cb是一个回调，第一个参数是当有错误发生时的错误信息,第二个参数是具体的服务器id。
exp.time = function (routeParam, msg, app, cb) {
    var timeServers = app.getServersByType('time');
    cb(null, timeServers[routeParam % timeServers.length].id);
}