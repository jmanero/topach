
exports.create = function(app, modules) {
	app.get('/', function(req, res, next) {
		res.locals.modules = modules || {};
		res.render('index.html');
	});
	
	app.get('/thanks', function(req, res, next) {
		res.locals.modules = modules;
		res.render('thanks.html');
	});
};
