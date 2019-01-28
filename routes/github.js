
/*
 * GET home page.
 */


 exports.github = function(req, res){
 	res.render('github', { title: 'IBM Whitewater - Devops Unlimited',token: '', email: '' });
 };

 exports.runStep = function(req, res){
 	var command=req.query.command;
 	console.log("Command :" + command);

 	var fs=require('fs');
 	var exec = require('child_process').exec;

 	var util = require('util');
 	var cmds=util.format(command);

 	var buildDir = req.session.buildDir;
 	console.log("Build Directory " + buildDir);

 	child = exec(cmds, { cwd:buildDir, env: process.env }, function (error, stdout, stderr) {
 		res.writeHead(200,{"Content-Type" : "text/html"});
 		res.write("Executing command " + cmds + '<br >');
 		if (error) {
 			var array1=stderr.split('. ');
 			for(var i=0;i<array1.length;i++){
 				console.log(array1[i] + '');
 				res.write(array1[i] + '');
 			}
 		}
 		if(stdout){
 			var array=stdout.split('. ');
 			for(var j=0;j<array.length;j++){
 				console.log("Command execution " + array[j]);
 				res.write('<pre>'+array[j] + '\n</pre>');
 			}
 		}

 		if(stderr){
 			var array2=stderr.split('. ');
 			for(var k=0;k<array2.length;k++){
 				console.log('<pre>'+array2[k] + '\n</pre>');
 				res.write('<pre>'+array2[k] + '\n</pre>');
 			}
 		}
 		res.end("Finish");
 	});
 };

 exports.buildconsole=function(req,res){
 	var repoDirFullPath = req.session.repoDirFullPath;
 	createBuildDirectoryHomeAndTriggerCodeCheckout(repoDirFullPath, req, res);
 }

 function checkoutCodeFromGit(req, res){

 	var url=req.query.giturl;
 	console.log(url);
 	var path=require('path');

 	var util = require('util');

 	var buildNumber = Math.floor((Math.random() * 1000) + 1);

 	// var buildDir= repoDirFullPath + "/" + buildNumber;
 	var buildDir = req.session.buildDir;

 	var isGit=path.extname(url);
 	if(isGit!=='.git'){
 		res.send("Application as of now supports only git repos.");
 	}else{
 		res.writeHead(200,{"Content-Type" : "text/html"});
 		// res.write("Starting");
 		var child='';
 		var fs=require('fs');
 		

 		// var cmds=util.format('git clone %s %s', url, dirName);

 		var spawn = require('child_process').spawn,

 		git = spawn('git', ['clone', url, buildDir, "--progress"]);
 		git.setMaxListeners(0);
 		git.stdout.on('data', function (data) {
 			console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
 			console.log('stdout: ' + data);
 			res.write("<pre>"+data+"</pre>");
 		});

 		git.stderr.on('data', function (data) {
 			console.log("############################################")
 			console.log('stderr: ' + data);
 			res.write("<pre>"+data+"</pre>");
 		});

 		git.on('exit', function (code) {
 			console.log('child process exited with code ' + code);
 			res.end("<pre>"+"Finish"+"</pre>");
 		});
 		

 		// git.kill();
 		
 		


 	}
 };

 exports.buildCode=function(req,res){

 	var url=req.query.giturl;
 	console.log(url);
 	
 	var path=require('path');
 	var util = require('util');
 	var randomDirectory = Math.floor((Math.random() * 1000) + 1);
 	var dirName = req.session.dirName;

 	res.writeHead(200,{"Content-Type" : "text/html"});
 	res.write("Starting");
 	var child='';
 	var fs=require('fs');
 	var exec = require('child_process').exec;

 	var cmds=util.format('mvn clean install -f '+dirName);

 	child = exec(cmds,{ env: process.env }, function (error, stdout, stderr) {
 		res.write("Executing command " + cmds + '<br >');
 		if (error) {
 			var array1=stderr.split('. ');
 			for(var i=0;i<array1.length;i++){
 				res.write(array1[i] + '');
 			}
 		}
 		if(stdout){
 			var array=stdout.split('. ');
 			for(var j=0;j<array.length;j++){
 				res.write('<pre>'+array[j] + '\n</pre>');
 			}
 		}

 		if(stderr){
 			var array2=stderr.split('. ');
 			for(var k=0;k<array2.length;k++){
 				res.write('<pre>'+array2[k] + '\n</pre>');
 			}
 		}
 		res.end("Finish");
 	});

 };

 exports.gitconsole = function(req, res){

 	var child='';
 	var cmd='echo "Hello"';
 	var exec = require('child_process').exec;

 	child = exec(cmd, function (error, stdout, stderr) {
 		if (error !== null) {
 			console.log('exec error: ' + error);
 			res.status(500).send('Something broke!: '+error);
 		}else{
 			console.log(stdout);
 			res.send(stdout);
 		}
 	});


 	this.createtravisyml=function(req, res){

 		var content=req.query.content;
 		var giturl=req.query.giturl;

 		var request = require('request');

 		var b = new Buffer(content);

 		var data= {"path": "travis.yml", "message": "Initial Commit", "committer": {"name": "ddewadkar", "email": "ddewadkar@in.moon.com"}, "content": b.toString('base64'),"branch": "master"};

 		console.log(data);

 		var url = 'https://github.moon.com/api/v3/repos/ddewadkar/GradleJava/contents/travis.yml?access_token=494bb7a47764206f168a3f0a78ff5093f65c9ff4';
 		request({
 			url: url,
 			method: 'PUT',
 			body: JSON.stringify(data)
 		}, function(error, request, body){
 			console.log(body);
 			if(error){
 				return callback(error);
 			}else{
 				return callback(null,body);
 			}
 		});
 	};

 };

 function createBuildDirectoryHomeAndTriggerCodeCheckout(repoDirFullPath, req, res){
 	var fs = require('fs');
 	var path = require('path');

 	var buildDirHome = repoDirFullPath + "builds";

 	console.log("Build Directory Home exists " + fs.existsSync(buildDirHome));
 	if (!fs.existsSync(buildDirHome)){
 		var mkdirp = require('mkdirp');
 		mkdirp(buildDirHome, function(err) { 
 			console.log("Created dir " + buildDirHome);
 			createBuildDirAndTriggerCheckout(buildDirHome, req, res);
 		});
 	}else{
 		createBuildDirAndTriggerCheckout(buildDirHome, req, res);
 	}

 }

 function createBuildDirAndTriggerCheckout(buildDirHome, req, res){
 	var fs = require('fs');
 	var path = require('path');
 	var max = 0;
 	fs.readdirSync(buildDirHome).forEach(function (file) {
 		var match = file.match(/\d+/g);
 		console.log(match);
 		if (!match)
 			return;

 		var num = Number(match);
 		if (num > max)
 			max = num;
 	});

 	console.log("Max : " + max);
 	// fs.mkdirSync(path.join(buildDir, ("000" + (max + 1)).slice(-3)));
 	var nodefs = require('node-fs');
 	var buildDir = path.join(buildDirHome, ("000" + (max + 1)).slice(-3));
 	nodefs.mkdir(buildDir, 0777, true, function (err) {
 		if (err) {
 			console.log("Error creating build directory " + err);
 		} else {
 			console.log('Build Directory ' + buildDir + ' created.');
 			req.session.buildDir = buildDir;
 			req.session.buildNumber = max+1;
 			console.log("Code checkout at : " + buildDir);
 			checkoutCodeFromGit(req, res);
 		}
 	});

 }