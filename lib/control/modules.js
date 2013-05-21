var FS = require('fs');
var Gravatar = require('gravatar');
var Path = require('path');
var Util = require('util');

exports.load = function(app, io, modPath) {
	var modules = {};

	FS.readdirSync(modPath).forEach(
			function(mod) {
				var path = Path.join(modPath, mod);
				var module = {};

				try {
					module = require(path);

					if (module.app && module.path) {
						console.log("Loading app at " + module.path);
						app.use(module.path, module.app);
					}

					if (module.socket)
						module.socket(io);

				} catch (e) {
					console.error("Unable to require module " + path);
				}

				FS.readFile(Path.join(path, 'package.json'), function(err, package) {
					if (err) {
						console.error("Unable to read package.json for " + mod);
						return;
					}

					try {
						package = JSON.parse(package);
						package.path = module.path;

						package.repo = ghNormalize(package.repository);

						if (package.contributors && package.contributors instanceof Array) {
							package.contributors = package.contributors.map(function(c) {
								if (typeof c != 'object') {
									return ({
										name : c
									});
								}

								if (c.email) {
									c.image = Gravatar.url(c.email, {
										s : 50,
										d : 'retro'
									});
								}
								
								return c;
							});
						}

						modules[mod] = package;
					} catch (e) {
						console.error("Unable to parse contents of package.json for " + mod + ". " + Util.inspect(e)
								+ "\n" + e.stack);
						return;
					}
				});
			});

	return modules;
}

function ghNormalize(repo) {
	if (typeof repo == 'object' && repo.url) {
		repo = repo.url;
	}

	if (typeof repo != 'string') {
		return;
	}

	repo = repo.replace('git://github.com', 'https://github.com');
	repo = repo.replace('git@github.com:', 'https://github.com/');

	return repo;
}
