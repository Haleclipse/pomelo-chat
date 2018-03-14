var pomelo = require('pomelo');
var routeUtil = require('./app/util/routeUtil');
var abuseFilter = require('./app/servers/chat/filter/abuseFilter');
var helloWorld = require('./app/components/HelloWorld');
var timeReport = require('./app/modules/timeReport')
/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'chatofpomelo-websocket');

// app configuration
app.configure('production|development', 'master', function () {
   app.load(helloWorld, {interval: 5000});
});


app.configure('production|development', 'connector', function(){
	app.set('connectorConfig',
		{
			connector : pomelo.connectors.hybridconnector,
			heartbeat : 3,
			useDict : true, // 路由压缩
			useProtobuf : true // pomelo的protobuf实现
		});
});

app.configure('production|development', 'gate', function(){
	app.set('connectorConfig',
		{
			connector : pomelo.connectors.hybridconnector,
            useDict : true,
			useProtobuf : true
		});
});

app.configure('production|development', 'chat', function () {
    app.filter(abuseFilter());
})

// app configure
app.configure('production|development', function() {
	// route configures
	app.route('chat', routeUtil.chat);
	app.route('time', routeUtil.time);

	// filter configures
	app.filter(pomelo.timeout());
});

// 这里registerAdmin可以接收两个或三个参数，如果是三个参数的话，第一个必须是字符串来指定moduleId。如果是两个参数的话，moduleId将使用第一个参数，也就是module的工厂函数的moduleId属性。这里由于我们给timeReport定义了moduleId属性，因此我们就省略掉了第一个moduleId参数了。最后一个参数是配置选项，可以配置监控数据获取是pull还是push方式，以及获取周期。在我们这个例子中，由于注册时没有传入任何关于type和interval的配置，将使用默认值，也就是使用拉模式，每隔5秒获取一次数据。
app.registerAdmin(timeReport, {app: app});

// start app
app.start();

process.on('uncaughtException', function(err) {
	console.error(' Caught exception: ' + err.stack);
});