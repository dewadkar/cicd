exports.login = function(req, res) {
	res.render('login', {
		title : 'Devops pipeline as a service',
		token : '',
		email : ''
	});
};

exports.passauth = function(req, res, next) {
	var passport = require('passport');
	passport.authenticate('ldapauth', {
		session : false
	}, function(err, user, info) {
		console.log("authenticating....");

		if (err) {
			console.log(err);
			return next(err);
		} else if (!user) {
			console.log(info);
			return res.render('login', {
				"info" : info
			});
		} else {
			console.log("User is..." + user.callupName);
			req.user = user;

			next();
		}

	})(req, res, next);
}

exports.authenticate = function(req, res) {

	var email = req.body.username;
	var name = req.user.callupName;
	assignTeamAndRedirect(email, req, res);
};

exports.signout = function(req, res) {
	req.session.destroy();
	res.redirect('/login');
}

function assignTeamAndRedirect(email, req, res) {
	var fs = require('fs');
	var path = require('path');

	fs.readdir(process.env.TOOLSTITCH_HOME + '/users/', function(err, files) {
		// console.log(files);

		for (var i = 0; i < files.length; i++) {
			console.log("Searching " + files[i].toString());
			var userPresent = isUserInFile(files[i], req, res, email);
			if (userPresent) {
				if (req.session.role.indexOf('superadmin') > -1) {
					res.redirect('admin/superadmin');
				} else {
					res.redirect('/devops');
				}

				break;
			}
		}
		if (!userPresent) {
			console.log("Log in unsuccessful, redirecting to login page")
			res.redirect('/login');
		}

	});
}

function isUserInFile(filename, req, res, email) {
	var fs = require('fs');
	var userPresent;
	deleteCachedFile(process.env.TOOLSTITCH_HOME + '/users/' + filename);
	var content = fs.readFileSync(process.env.TOOLSTITCH_HOME + '/users/' + filename);
	var endOfLine = require('os').EOL;
	var users = content.toString().split(endOfLine);
	for (i in users) {
		// console.log("Reading synchronously " + users[i]);
		var parts = users[i].split(',');
		console.log(parts[0]);
		if (parts[0] == email) {

			console.log("Team ************* " + parts[1]);
			/*if(password.trim()  != parts[2].trim()){
				break;
			}*/
			userPresent = true;
			req.session.email = email;
			req.session.team = parts[1];
			req.session.loggedIn = true;
			req.session.role = parts[2];
			if (parts[2].indexOf('admin') > -1) {
				req.session.adminteam = parts[1];
			}
			if (parts[2].indexOf('superadmin') > -1) {
				req.session.superadminteam = parts[1];
			}
			console.log(email + ' found in ' + filename);
			userPresent = true;
			break;
		}
	}
	return userPresent;
}

function deleteCachedFile(filePath) {
	var path = require('path');
	// console.log(path.resolve(filePath));
	delete require.cache[path.resolve(filePath)];
};