 exports.redirectToGithub = function(req, res){
 	var query = require('url').parse(req.url,true).query;
 	/*if(query.email == undefined){
 		console.log("Please provide email");
 		res.writeHead(302, {
 			'Location': '/github'
 		});
 		res.end();
 	}*/
 	// console.log(req.session.toString());
 	req.session.email = query.email;
 	console.log("Session token " + req.session.token)
 	var client_id_localhost = '7f0707e7ba663ef4004f';
 	var client_id_dpev181 = '381711d58e7c0bfc38fb';
 	var client_id_dpev938 = 'c636920a9046932f0240';
 	var client_id = client_id_localhost;
 	// var client_id = client_id_dpev181; 	
 	// var client_id = client_id_dpev938; 	
 	
 	res.writeHead(302, {
 		'Location': 'https://github.moon.com/login/oauth/authorize?client_id='+client_id+'&scope=admin:org,admin:public_key'
 	});
 	res.end();
 }

 exports.saveToken = function(req, res){

 	console.log("Session - email "+req.session.email);
 	console.log("Session - token "+req.session.token);
 	var code = '';
 	var useremail = '';

 	var db = require('../lib/db.js');
 	var https = require('https');
 	var http = require('http');
 	var request = require('request');
 	var querystring = require('querystring');

 	var reqUrl = req.url;
 	code = reqUrl.split('=')[1];

 	console.log("Git API access code received : " + code)
 	var postURL = 'github.moon.com/login/oauth/access_token';

 	var client_secret_localhost = '39ee68fb00b5a380dc2ccd41dd7c4f3b7d58d163';
 	var client_secret_dpev181 = '7ccb9dbfb6326cd9315722b2cfbf6717d544b132';
 	var client_secret_dpev938 = '75996cbfdc5604fa003486cbdf207b4d58316541';
 	var client_id_localhost = '7f0707e7ba663ef4004f';
 	var client_id_dpev181 = '381711d58e7c0bfc38fb';
 	var client_id_dpev938 = 'c636920a9046932f0240';

 	// client_id = client_id_dpev181;
 	// client_secret = client_secret_dpev181;

 	// client_id = client_id_dpev938;
 	// client_secret = client_secret_dpev938;

 	client_id = client_id_localhost;
 	client_secret = client_secret_localhost;

 	var data = querystring.stringify({
 		client_id : client_id,
 		client_secret : client_secret,
 		code : code

 	});


 	console.log(req.session.email);
 	useremail = req.session.email;


 	var options = {
 		host : 'github.moon.com',
 		path : '/login/oauth/access_token',
 		port : 443,
 		method : 'POST',
 		headers : headers
 	};

 	var headers = {
 		'Content-Type' : 'application/json',
 		'Content-Length' : data.length
 	};

 	var accessToken;


 	var post_req = https.request(options, function(res) {
 		var body = "";

 		res.setEncoding('utf8');
 		res.on('data', function(chunk) {
 			body += chunk;
 		});

 		res.on('end', function() {
			// console.log("Response " + body);
			var atStartIndex = body.indexOf("=") + 1;
			var atEndIndex = body.indexOf("&");
			accessToken = body.substr(atStartIndex, (atEndIndex - atStartIndex));
			console.log("-- Git access token received -- " + accessToken);
			addAccessTokenToSession(accessToken);
			addSshKey(accessToken);
		});
 	});
 	post_req.write(data);
 	post_req.end();
 	function addAccessTokenToSession(token){
 		req.session.token = token;
 		res.cookie("token", token);
 		console.log("Added following access token to session - " + req.session.token );
 		console.log("Token in session " + req.session.token);
 		deleteCachedFile(process.env.TOOLSTITCH_HOME + '/teams/'+req.session.team+'.json');
 		var teamConfig = require(process.env.TOOLSTITCH_HOME + '/teams/'+req.session.team+'.json'); 	
 		//res.render('github', { title: 'IBM Whitewater - Devops Unlimited', token: req.session.token, email:req.session.email });
 		// res.render('pipeline', { title: 'IBM Whitewater - Devops Unlimited', token: req.session.token, email:req.session.email });
 		res.render('automate/configure/codecheckoutgithub', {
 			title: 'Devops pipeline as a service',
 			email: req.session.email,
 			serveruri: teamConfig.pipeline.config.rtc.serveruri,
 			workspace: teamConfig.pipeline.config.rtc.workspace,
 			username: teamConfig.pipeline.config.rtc.username,
 			password: teamConfig.pipeline.config.rtc.password,
 			token: req.session.token
 		});
 		
 	}


 };

 function addSshKey(token){

 	var https = require('https');
 	var http = require('http');
 	var request = require('request');
 	var querystring = require('querystring');

 	var data = {
 		"title" : "dpev181",
 		"key" : "ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAryWN2pGCOkr3tXF0prmg/kqUWI+TlsDe+aX2gmlihgSMkYvjyTjSz/p2w7PikDU1VW085FeryRVKIHlaCRNsBLDlTOHlUl7lT0DPgo0E3FD//iK/qlKHkeQdd+KcTOD8Th2bps7uRtHNT5cUQ9/k4cd/ZurJkxfi2yBvCnLhnxds9S9LfYXEoT1Zaov9nyah7Ev16E0YwJXq7wTLRQnl2Nqw+5NMV8wRpoxT9e3JVk1NdJxCenAb3aDbenCZsKhCvwre/MKmHy6bX8kNywlVmPI4TlqdXGObY6CXo/Z0yZIMU7zPTamorPk3/AoBJHB6HyyQA3Hzld1szLsG0YlJSQ== root@dpev181"
 	};

 	var options = {
 		host : 'github.moon.com',
 		path : '/api/v3/user/keys?access_token='+token,
 		port : 443,
 		method : 'POST',
 		headers : headers
 	};

 	var headers = {
 		'Content-Type' : 'application/json',
 		'Content-Length' : data.length
 	};

 	var post_req = https.request(options, function(res) {
 		var body = "";

 		res.setEncoding('utf8');
 		res.on('data', function(chunk) {
 			body += chunk;
 		});


 		res.on('error', function(e) {
 			console.log('error');
 			console.log(e);
 		});

 		res.on('end', function() {
 			console.log("Adding ssh key : " + token);
 			console.log("Response " + body); 				
 		});
 	});
 	post_req.write(JSON.stringify(data));
 	post_req.end();

 }

 function deleteCachedFile(filePath){
 	var path = require('path');
	// console.log(path.resolve(filePath));
	delete require.cache[path.resolve(filePath)];
};