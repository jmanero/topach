
exports.create = function(app) {
	app.get('/', function(req, res, next) {
		res.render('index.html');
	});
	
	app.get('/legal', function(req, res, next) {
		res.render('legal.html');
	});
	
	app.get('/thanks', function(req, res, next) {
		res.render('thanks.html');
	});
};
