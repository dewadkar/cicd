
//localhost
var oauth2 = require('simple-oauth2')({
	clientID : 'df54ac7a77a68ca8c96c',
	clientSecret : '1e88e9c01130a267af85444c77384e55f219cf82',
	site : 'https://github.moon.com/login',
	tokenPath : '/oauth/access_token',
	authorizationPath : '/oauth/authorize'
});

//toolstitch.innovate.moon.com
/*var oauth2 = require('simple-oauth2')({
	clientID : '2d7d9cf04227dcd5ff77',
	clientSecret : '4c0c209cb2eefe5c7bcdadfc1f70b52249b44e25',
	site : 'https://github.moon.com/login',
	tokenPath : '/oauth/access_token',
	authorizationPath : '/oauth/authorize'
});*/

// Authorization uri definition
var authorization_uri = oauth2.authCode.authorizeURL({
	// redirect_uri: 'http://localhost:3000/callback',
	scope : 'admin:org,admin:public_key,write:public_key',
	state : '3(#0/!~'
});

exports.redirectToAuthUrl = function(req, res) {
	res.redirect(authorization_uri);
}

exports.getAccessToken = function(req, res, next) {
	console.log("in getAccessToken...")
	req.err = [];
	var code = req.query.code;
	console.log("Code  " + code);

	oauth2.authCode.getToken({
		code : code,
	// redirect_uri: 'http://localhost:3000/callback'
}, saveToken);

	function saveToken(error, result) {
		if (error || result === null) {
			console.log('Access Token Error', error.message);
			req.err.push(error);
			next();
		} else {
			token = oauth2.accessToken.create(result);
			console.log("Got token here..." + token);
			var atStartIndex = token.token.indexOf("=") + 1;
			var atEndIndex = token.token.indexOf("&");
			accessToken = token.token.substr(atStartIndex,
				(atEndIndex - atStartIndex));
			console.log("Git access token received -- " + accessToken);
			req.session.token = accessToken;
			next();
		}
	}
}

exports.getSSHKey = function(req, res, next) {
	console.log('in getSSHKey...');

	if (req.err && req.err.length > 0) {
		console.log("has error there..........................")
		next();
	}

	var teamName = req.session.team;

	deleteCachedFile(process.env.TOOLSTITCH_HOME + '/teams/'+ teamName +'.json');
	var teamConfig = require(process.env.TOOLSTITCH_HOME + '/teams/'+teamName+'.json');

	var data = {}
	// need to replace below lines for proper namespace and tool name at runtime...
	// Only adding jenkins container key to github
	//data['namespace'] = "wwwr";
	var namespace = teamConfig.teamns;
	data['namespace'] = namespace
	console.log("Adding key for namespace " + namespace);
	data['app'] = "jenkins";

	var hosttool = require('../lib/hosttool');
	hosttool.getSSHKey(data, function(error, result) {
		if (error || result === null) {
			console.log("Unable to get ssh key : " + error);
			// return next(new Error("Unable to get ssh key."));
			req.err.push(error);
			next();
		} else {
			req.session.sshKey = result;
			next();
		}
	});
}

exports.addSSHKey = function(req, res, next) {
	console.log('in addSSHKey...');

	if (req.err && req.err.length > 0) {
		next();
	}

	var sshKey = req.session.sshKey;
	var accessToken = req.session.token;
	var jsonObject = JSON.parse(sshKey);

	var github = require('../lib/github/github');
	github.addSSHKey(accessToken, jsonObject, function(error, result) {
		if (error || result === null) {
			console.log(error);
			// return next(new Error("Unable to add ssh key."));
			req.err.push(error);
			next();
		} else {
			next();
		}
	});
}

exports.redirectToGitHubPage = function(req, res) {
	console.log('In Github Redirect Page...');
	token = req.session.token;
	res.cookie("token", token);
	console.log("Token in session " + req.session.token);
	deleteCachedFile(process.env.TOOLSTITCH_HOME + "/teams/" + req.session.team + '.json');
	var teamConfig = require(process.env.TOOLSTITCH_HOME + '/teams/' + req.session.team + '.json');
	var from = req.session.gitAuthFrom;
	res.render('automate/configure/codecheckoutgithub', {
		title : 'Devops pipeline as a service',
		email : req.session.email,
		githubRepoUrl : teamConfig.pipeline[from].config.github.githubRepoUrl,
		githubBranch : teamConfig.pipeline[from].config.github.githubBranch,
		username : teamConfig.pipeline[from].config.github.username,
		from : from,
		token : req.session.token,
		errors : req.err,
	});

}

function deleteCachedFile(filePath) {
	var path = require('path');
	// console.log(path.resolve(filePath));
	delete require.cache[path.resolve(filePath)];
};